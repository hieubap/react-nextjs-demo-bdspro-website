const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const vtPbf = require("vt-pbf");
const geojsonVt = require("geojson-vt").default;

// ================= CONFIG =================
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v7.db");
const OUTPUT_DIR = path.join(__dirname, "data/tiles_v7");
const RESULT_FILE = path.join(__dirname, "result_mvt.txt");

const MIN_ZOOM = 5;
const MAX_ZOOM = 14;

// Xóa file log cũ
if (fs.existsSync(RESULT_FILE)) fs.unlinkSync(RESULT_FILE);

// ================= DB =================
const db = new Database(DB_PATH, { readonly: true });

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
  "water",
  "natural",
  "service",
  "power",
  "landuse",
  "amenity",
  "leisure",
  "barrier",
  "place",
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

// ================= SQL CONFIG =================
const sql9 = `WITH ranked AS (
  SELECT *,
    CASE
      WHEN geomType IN ('Polygon','MultiPolygon') THEN area
      WHEN geomType IN ('LineString','MultiLineString') THEN lineLength
      ELSE 0
    END AS score,

    CASE
      WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
      WHEN (highway IN ('motorway','motorway_junction','motorway_link','trunk')) THEN 'highway'
      WHEN (water IN ('river','lake')) THEN 'water'
    END AS grp,

    ROW_NUMBER() OVER (
      PARTITION BY 
        CASE
          WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
          WHEN (highway IN ('motorway','motorway_junction','motorway_link','trunk')) THEN 'highway'
          WHEN (water IN ('river','lake')) THEN 'water'
        END
      ORDER BY 
        CASE
          WHEN geomType IN ('Polygon','MultiPolygon') THEN area
          WHEN geomType IN ('LineString','MultiLineString') THEN lineLength
          ELSE 0
        END DESC
    ) as rn
  FROM places
  WHERE (
      (label=0 AND admin_level IN ('2','4'))
      OR (highway IN ('motorway','motorway_junction','motorway_link','trunk'))
      OR (water IN ('river','lake'))
    )
)
SELECT * FROM ranked WHERE rn <= 50000;`;

// ================= SQL CONFIG =================
const sql14 = `WITH ranked AS (
    SELECT *,
      CASE
        WHEN geomType IN ('Polygon','MultiPolygon') THEN area
        WHEN geomType IN ('LineString','MultiLineString') THEN lineLength
        ELSE 0
      END AS score,
  
      CASE
        WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
        WHEN (highway not null) THEN 'highway'
        WHEN (water IN ('river','lake')) THEN 'water'
      END AS grp,
  
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE
            WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
            WHEN (highway not null) THEN 'highway'
            WHEN (water IN ('river','lake')) THEN 'water'
          END
        ORDER BY 
          CASE
            WHEN geomType IN ('Polygon','MultiPolygon') THEN area
            WHEN geomType IN ('LineString','MultiLineString') THEN lineLength
            ELSE 0
          END DESC
      ) as rn
    FROM places
    WHERE (
        (label=0 AND admin_level IN ('2','4'))
        OR (highway not null)
        OR (water IN ('river','lake'))
      )
  )
  SELECT * FROM ranked WHERE rn <= 50000;`;

const SQL_CONFIGS = [
  {
    maxZ: 5,
    tolerance: 5,
    sql: `SELECT * FROM places WHERE label=0 AND admin_level IN ('2')`,
  },
  {
    maxZ: 9,
    tolerance: 1,
    sql: sql9,
  },
  {
    maxZ: 16,
    tolerance: 0.02,
    sql: sql14,
  },
];

// ================= BBOX =================
const VIETNAM_BBOX = {
  minLat: 8.18,
  maxLat: 23.39,
  minLng: 102.14,
  maxLng: 109.46,
};

// ================= UTILS =================
function lngToTileX(lng, z) {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, z));
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      Math.pow(2, z)
  );
}

function getTileRange(z) {
  return {
    xMin: lngToTileX(VIETNAM_BBOX.minLng, z),
    xMax: lngToTileX(VIETNAM_BBOX.maxLng, z),
    yMin: latToTileY(VIETNAM_BBOX.maxLat, z),
    yMax: latToTileY(VIETNAM_BBOX.minLat, z),
  };
}

// ================= CORE =================

// build tất cả tileIndex
function buildTileIndexes() {
  const result = [];

  for (const cfg of SQL_CONFIGS) {
    console.log(`🧠 Build index maxZ=${cfg.maxZ}`);

    const rows = db.prepare(cfg.sql).all();

    const features = rows.map((row) => ({
      type: "Feature",
      properties: {
        ...row.properties,
        osm_id: row.osm_id,
        label: allowedKeys[row.label] || "unknown",
      },
      geometry: {
        type: row.geomType,
        coordinates: JSON.parse(row.geomCoordinates),
      },
    }));

    console.log(`   → ${features.length} features`);

    const tileIndex = geojsonVt(
      { type: "FeatureCollection", features },
      {
        maxZoom: MAX_ZOOM,
        indexMaxPoints: 5000,
        tolerance: cfg.tolerance,
        extent: 4096,
        buffer: 64,
      }
    );

    result.push({
      maxZ: cfg.maxZ,
      tileIndex,
    });
  }

  return result;
}

function getTileIndex(z, indexes) {
  return indexes.find((i) => z <= i.maxZ)?.tileIndex;
}

function writeTile(tileIndex, z, x, y) {
  const tile = tileIndex.getTile(z, x, y);
  if (!tile) return;

  const dir = path.join(OUTPUT_DIR, String(z), String(x));
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, `${y}.pbf`),
    vtPbf.fromGeojsonVt({ vietnam: tile })
  );
}

// ================= MAIN =================
console.log("🚀 Start build MVT (multi-sql optimized)");

const startAll = Date.now();

// build index 1 lần
const tileIndexes = buildTileIndexes();

for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
  const zoomStart = Date.now();
  console.log(`Zoom ${z}...`);

  const tileIndex = getTileIndex(z, tileIndexes);
  if (!tileIndex) continue;

  const { xMin, xMax, yMin, yMax } = getTileRange(z);

  let tileCount = 0;

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      writeTile(tileIndex, z, x, y);
      tileCount++;
    }
  }

  const zoomTime = Date.now() - zoomStart;

  fs.appendFileSync(
    RESULT_FILE,
    `Zoom ${z}: ${zoomTime} ms | tiles: ${tileCount}\n`
  );

  console.log(`⏱️ Zoom ${z}: ${zoomTime}ms | tiles: ${tileCount}`);
}

// tổng thời gian
const totalTime = Date.now() - startAll;

fs.appendFileSync(
  RESULT_FILE,
  `TOTAL: ${totalTime} ms (${(totalTime / 1000).toFixed(2)}s)\n`
);

console.log(`🔥 DONE in ${(totalTime / 1000).toFixed(2)}s`);

db.close();
