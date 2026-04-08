// ===== import-geojson-ndjson.js =====
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const Database = require("better-sqlite3");
const turf = require("@turf/turf");

// ===== CONFIG =====
const DB_DIR = path.join(__dirname, "sqlite/data");
const DB_PATH = path.join(DB_DIR, "vietnam_v7.db");
const GEOJSON_PATH = path.join(__dirname, "data/vietnam.ndjson"); // NDJSON
const BATCH_SIZE = 20000;

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

// ===== allowed keys =====
const allowedKeys = [
  "boundary",
  "highway",
  "waterway",
  "aerialway",
  "railway",
  "aeroway",
  "building",
  "name",
  "layer",
  "natural",
  "service",
  "power",
  "landuse",
  "amenity",
  "leisure",
  "barrier",
  "place",
  "water",
  "office",
  "wall",
  "golf",
  "noexit",
  "traffic_calming",
  "shop",
  "meadow",
  "embankment",
  "man_made",
  "source",
  "route",
  "bridge",
  "tourism",
  "historic",
  "public_transport",
  "military",
  "indoor",
  "industrial",
  "advertising",
  "cemetery",
];
// ===== helper =====
function extractLabelTag(props) {
  for (let i = 0; i < allowedKeys.length; i++) {
    const key = allowedKeys[i];
    if (key in props && props[key] != null) {
      return {
        label: i,
        tag: String(props[key]), // giá trị của key chính là tag
      };
    }
  }
  return { label: null, tag: null };
}

// ===== Helper functions =====
function extractLabel(props) {
  for (let i = 0; i < allowedKeys.length; i++) {
    if (Object.keys(props).some((k) => k.includes(allowedKeys[i]))) return i;
  }
  return null;
}

function extractTagName(props) {
  let tag = null;
  let name = props.name || null;
  for (const [k, v] of Object.entries(props)) {
    if (k === "name" || k === "osm_id" || v == null) continue;
    const parts = k.split(":");
    tag = parts[1] || null;
    if (!name) name = String(v);
    break;
  }
  return { tag, name };
}

function getBBox(geom) {
  const lats = [],
    lngs = [];
  const collect = (coords) => {
    if (typeof coords[0] === "number") {
      lngs.push(coords[0]);
      lats.push(coords[1]);
    } else coords.forEach(collect);
  };

  try {
    switch (geom.type) {
      case "Point":
        collect(geom.coordinates);
        break;
      case "LineString":
      case "MultiPoint":
        geom.coordinates.forEach(collect);
        break;
      case "Polygon":
      case "MultiLineString":
        geom.coordinates.forEach((r) => r.forEach(collect));
        break;
      case "MultiPolygon":
        geom.coordinates.forEach((p) => p.forEach((r) => r.forEach(collect)));
        break;
      default:
        return null;
    }
  } catch {
    return null;
  }

  if (!lats.length) return null;
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
}

function getAreaLength(geom) {
  try {
    let area = null,
      lineLength = null;
    const g = turf.feature(geom);
    switch (geom.type) {
      case "Polygon":
      case "MultiPolygon":
        area = turf.area(g);
        break;
      case "LineString":
      case "MultiLineString":
        lineLength = turf.length(g, { units: "meters" });
        break;
    }
    return { area, lineLength };
  } catch {
    return { area: null, lineLength: null };
  }
}

// ===== DB setup =====
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
    label INTEGER,
    tag TEXT,
    minLat REAL,
    maxLat REAL,
    minLng REAL,
    maxLng REAL,
    geomType TEXT,
    geomCoordinates TEXT,
    tags TEXT,
    area REAL,
    lineLength REAL,
    properties TEXT,
    admin_level TEXT,
    highway TEXT,
    water TEXT,
    natural TEXT,
    leisure TEXT,
    amenity TEXT,
    barrier TEXT,
    place TEXT,
    office TEXT
  );
`);

console.log("📦 Table ready");

const stmt = db.prepare(`
  INSERT INTO places 
  (osm_id,name,label,tag,minLat,maxLat,minLng,maxLng,geomType,geomCoordinates,tags,area,lineLength,properties,admin_level,highway,water,natural,leisure,amenity,barrier,place,office)
  VALUES 
  (@osm_id,@name,@label,@tag,@minLat,@maxLat,@minLng,@maxLng,@geomType,@geomCoordinates,@tags,@area,@lineLength,@properties,@admin_level,@highway,@water,@natural,@leisure,@amenity,@barrier,@place,@office)
`);

const insertBatch = db.transaction((rows) => {
  for (const row of rows) stmt.run(row);
});

// ===== Read NDJSON line by line =====
(async () => {
  const start = Date.now();
  let count = 0;
  let batch = [];

  const rl = readline.createInterface({
    input: fs.createReadStream(GEOJSON_PATH, {
      highWaterMark: 1024 * 1024 * 16,
    }),
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const feature = JSON.parse(line);
      const props = feature.properties || {};
      const geom = feature.geometry;
      if (!geom) continue;

      const bbox = getBBox(geom);
      if (!bbox) continue;

      const { label, tag } = extractLabelTag(props);
      if (label === null) continue;

      let name = props.name || null;
      const cleanTags = { ...props };
      delete cleanTags.name;
      delete cleanTags.osm_id;

      const { area, lineLength } = getAreaLength(geom);

      batch.push({
        osm_id: props.osm_id ? String(props.osm_id) : null,
        name,
        label,
        tag,
        ...bbox,
        geomType: geom.type,
        geomCoordinates: JSON.stringify(geom.coordinates),
        tags: JSON.stringify(cleanTags),
        area,
        lineLength,
        properties: JSON.stringify(props),
        admin_level: props.admin_level ? String(props.admin_level) : null,
        highway: props.highway ? String(props.highway) : null,
        water: props.water ? String(props.water) : null,
        natural: props.natural ? String(props.natural) : null,
        leisure: props.leisure ? String(props.leisure) : null,
        amenity: props.amenity ? String(props.amenity) : null,
        barrier: props.barrier ? String(props.barrier) : null,
        place: props.place ? String(props.place) : null,
        office: props.office ? String(props.office) : null,
      });

      count++;
      if (batch.length >= BATCH_SIZE) {
        insertBatch(batch);
        batch = [];
        const elapsed = ((Date.now() - start) / 1000).toFixed(1);
        const speed = (count / elapsed).toFixed(0);
        process.stdout.write(
          `\r⏳ Inserted: ${count} | ${speed} rows/s | ${elapsed}s`
        );
      }
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    }
  }

  if (batch.length > 0) insertBatch(batch);

  console.log("\n🔧 Creating indexes...");
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_label ON places(label);
    CREATE INDEX IF NOT EXISTS idx_tag ON places(tag);
    CREATE INDEX IF NOT EXISTS idx_name ON places(name);
    CREATE INDEX IF NOT EXISTS idx_geomType ON places(geomType);
    CREATE INDEX IF NOT EXISTS idx_bbox ON places(minLat, maxLat, minLng, maxLng);
    CREATE INDEX IF NOT EXISTS idx_admin_level ON places(admin_level);
    CREATE INDEX IF NOT EXISTS idx_highway ON places(highway);
    CREATE INDEX IF NOT EXISTS idx_water ON places(water);
    CREATE INDEX IF NOT EXISTS idx_natural ON places(natural);
    CREATE INDEX IF NOT EXISTS idx_leisure ON places(leisure);
    CREATE INDEX IF NOT EXISTS idx_amenity ON places(amenity);
    CREATE INDEX IF NOT EXISTS idx_barrier ON places(barrier);
    CREATE INDEX IF NOT EXISTS idx_place ON places(place);
    CREATE INDEX IF NOT EXISTS idx_office ON places(office);
  `);

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`✅ Done! Total: ${count} features in ${elapsed}s`);
  console.log(`🚀 Avg speed: ${(count / elapsed).toFixed(0)} rows/s`);
  db.close();
})();
