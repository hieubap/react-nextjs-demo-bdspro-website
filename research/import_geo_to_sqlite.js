// ===== import-geojson.js =====
const fs = require("fs");
const path = require("path");
const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { pick } = require("stream-json/filters/pick.js");
const { streamArray } = require("stream-json/streamers/stream-array.js");
const Database = require("better-sqlite3");

// ===== CONFIG =====
const DB_DIR = path.join(__dirname, "sqlite/data");
const DB_PATH = path.join(DB_DIR, "vietnam_v4.db");
const GEOJSON_PATH = path.join(__dirname, "data/vietnam.geojson");
const BATCH_SIZE = 10000;

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

db.exec(`
  PRAGMA journal_mode = OFF;
  PRAGMA synchronous = OFF;
  PRAGMA cache_size = -65536;
  PRAGMA temp_store = MEMORY;
  PRAGMA mmap_size = 536870912;
  PRAGMA locking_mode = EXCLUSIVE;

  CREATE TABLE IF NOT EXISTS places (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    osm_id TEXT,
    name TEXT,
    label TEXT,
    tag TEXT,
    minLat REAL,
    maxLat REAL,
    minLng REAL,
    maxLng REAL,
    geomType TEXT,
    geomCoordinates TEXT,
    tags TEXT
  );
`);

console.log("📦 Table ready");

const stmt = db.prepare(`
  INSERT INTO places (osm_id, name, label, tag, minLat, maxLat, minLng, maxLng, geomType, geomCoordinates, tags)
  VALUES (@osm_id, @name, @label, @tag, @minLat, @maxLat, @minLng, @maxLng, @geomType, @geomCoordinates, @tags)
`);

const insertBatch = db.transaction((rows) => {
  for (const row of rows) stmt.run(row);
});

function extractLabelTagName(props) {
  let label = null;
  let tag = null;
  let name = props.name || null;

  for (const [k, v] of Object.entries(props)) {
    if (k === "name" || k === "osm_id" || v === null || v === undefined) continue;

    const parts = k.split(":");
    label = parts[0];
    tag = parts[1] || null;
    if (!name) name = String(v);
    break;
  }

  return { label: label || "unknown", tag: tag || null, name };
}

function getBBox(geom) {
  const lats = [], lngs = [];

  const collect = (coords) => {
    if (typeof coords[0] === "number") {
      lngs.push(coords[0]);
      lats.push(coords[1]);
    } else {
      coords.forEach(collect);
    }
  };

  try {
    switch (geom.type) {
      case "Point":           collect(geom.coordinates); break;
      case "LineString":
      case "MultiPoint":      geom.coordinates.forEach(collect); break;
      case "Polygon":
      case "MultiLineString": geom.coordinates.forEach((r) => r.forEach(collect)); break;
      case "MultiPolygon":    geom.coordinates.forEach((p) => p.forEach((r) => r.forEach(collect))); break;
      default: return null;
    }
  } catch {
    return null;
  }

  if (lats.length === 0) return null;

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

// ===== Stream pipeline =====
const start = Date.now();
let count = 0;
let batch = [];

const pipeline = chain([
  fs.createReadStream(GEOJSON_PATH, { highWaterMark: 256 * 1024 }),
  parser({ streamValues: false }),
  pick({ filter: "features" }),
  streamArray(),
]);

pipeline.on("data", ({ value: feature }) => {
  try {
    const props = feature.properties || {};
    const geom = feature.geometry;
    if (!geom) return;

    const bbox = getBBox(geom);
    if (!bbox) return;

    const { label, tag, name } = extractLabelTagName(props);

    const cleanTags = { ...props };
    delete cleanTags.name;
    delete cleanTags.osm_id;

    batch.push({
      osm_id: props.osm_id ? String(props.osm_id) : null,
      name,
      label,
      tag,
      ...bbox,
      geomType: geom.type,                                  // "Point" | "Polygon" | ...
      geomCoordinates: JSON.stringify(geom.coordinates),    // chỉ lưu coordinates
      tags: JSON.stringify(cleanTags),
    });

    count++;

    if (batch.length >= BATCH_SIZE) {
      pipeline.pause();
      insertBatch(batch);
      batch = [];
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      const speed = (count / elapsed).toFixed(0);
      process.stdout.write(`\r⏳ Inserted: ${count} | ${speed} rows/s | ${elapsed}s`);
      pipeline.resume();
    }
  } catch (err) {
    console.error("❌ Error:", err);
  }
});

pipeline.on("end", () => {
  if (batch.length > 0) insertBatch(batch);

  console.log("\n🔧 Creating indexes...");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_label ON places(label);
    CREATE INDEX IF NOT EXISTS idx_tag ON places(tag);
    CREATE INDEX IF NOT EXISTS idx_name ON places(name);
    CREATE INDEX IF NOT EXISTS idx_geomType ON places(geomType);
  `);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`✅ Done! Total: ${count} features in ${elapsed}s`);
  console.log(`🚀 Avg speed: ${(count / elapsed).toFixed(0)} rows/s`);
  db.close();
});

pipeline.on("error", (err) => {
  console.error("❌ Stream error:", err);
  db.close();
});