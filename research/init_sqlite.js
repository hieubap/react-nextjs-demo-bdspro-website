const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// ===== ENV của bạn =====
const DB_DIR = path.join(__dirname, "sqlite/data");
const DB_PATH = path.join(DB_DIR, "vietnam_v4.db");
const GEOJSON_PATH = path.join(__dirname, "data/vietnam.geojson");
const STYLE_PATH = path.join(__dirname, "data/style.json");
const BATCH_SIZE = 10000;

// ===== Utils =====
function parseJSONSafe(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// convert row -> feature
function rowToFeature(row) {
  return {
    type: "Feature",
    properties: {
      id: row.id,
      name: row.name,
      label: row.label,
      tag: row.tag,
      ...parseJSONSafe(row.tags, {}),
    },
    geometry: {
      type: row.geomType,
      coordinates: parseJSONSafe(row.geomCoordinates, []),
    },
  };
}

// ===== Generate style.json =====
function genStyle() {
  return {
    version: 8,
    name: "Vietnam Map",
    sources: {
      vietnam: {
        type: "geojson",
        data: "./vietnam.geojson",
      },
    },
    layers: [
      {
        id: "polygon-fill",
        type: "fill",
        source: "vietnam",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: {
          "fill-color": "#088",
          "fill-opacity": 0.4,
        },
      },
      {
        id: "polygon-line",
        type: "line",
        source: "vietnam",
        paint: {
          "line-color": "#000",
          "line-width": 1,
        },
      },
      {
        id: "point-layer",
        type: "circle",
        source: "vietnam",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 3,
          "circle-color": "#f00",
        },
      },
    ],
  };
}

// ===== Main =====
async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error("❌ DB not found:", DB_PATH);
    return;
  }

  // ensure output dir
  fs.mkdirSync(path.dirname(GEOJSON_PATH), { recursive: true });

  const db = new sqlite3.Database(DB_PATH);

  let offset = 0;
  let hasMore = true;

  const writeStream = fs.createWriteStream(GEOJSON_PATH);

  // start GeoJSON
  writeStream.write('{"type":"FeatureCollection","features":[\n');

  let isFirst = true;

  while (hasMore) {
    const rows = await new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM places LIMIT ${BATCH_SIZE} OFFSET ${offset}`,
        [],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    if (rows.length === 0) {
      hasMore = false;
      break;
    }

    for (const row of rows) {
      const feature = rowToFeature(row);

      if (!isFirst) {
        writeStream.write(",\n");
      }

      writeStream.write(JSON.stringify(feature));
      isFirst = false;
    }

    offset += BATCH_SIZE;
    console.log(`✅ Processed ${offset} rows`);
  }

  // end GeoJSON
  writeStream.write("\n]}");
  writeStream.end();

  db.close();

  // ===== Generate style.json =====
  const style = genStyle();
  fs.writeFileSync(STYLE_PATH, JSON.stringify(style, null, 2));

  console.log("🎉 Done:");
  console.log(" - GeoJSON:", GEOJSON_PATH);
  console.log(" - Style:", STYLE_PATH);
}

main().catch(console.error);
