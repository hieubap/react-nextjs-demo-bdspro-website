const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");
const vtPbf = require("vt-pbf");
const geojsonVt = require("geojson-vt").default;

const simplify = require("@turf/simplify").default;
const area = require("@turf/area").default;
const length = require("@turf/length").default;

// 🔥 giữ feature lớn nhất theo label
function pickTopNPerLabel(features, topN = 2) {
  const groups = new Map();

  // group theo label
  for (const f of features) {
    const label = f.properties?.label || "unknown";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(f);
  }

  const result = [];

  for (const items of groups.values()) {
    const scored = items.map((f) => {
      let score = 0;

      if (f.geometry.type === "Polygon" || f.geometry.type === "MultiPolygon") {
        score = area(f);
      } else if (
        f.geometry.type === "LineString" ||
        f.geometry.type === "MultiLineString"
      ) {
        score = length(f);
      }

      return { f, score };
    });

    // sort giảm dần
    scored.sort((a, b) => b.score - a.score);

    // lấy top N
    const top = scored.slice(0, topN).map((x) => x.f);

    result.push(...top);
  }

  return result;
}
// ================= CONFIG =================
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v7.db");
const OUTPUT_DIR = path.join(__dirname, "data/tiles_v7");

const VIETNAM_BBOX = {
  minLat: 8.18,
  maxLat: 23.39,
  minLng: 102.14,
  maxLng: 109.46,
};

const SIMPLIFY_CONFIG = {
  tolerance: {
    0: 12,
    1: 10,
    2: 8,
    3: 6,
    4: 0.005,
    5: 0.005,
    6: 0.001,
    7: 0.0001,
    8: 0.00001,
    9: 0.00001,
    10: 0.0001,
    11: 0.0001,
    12: 0.00002,
    13: 0.00002,
    14: 0.00002,
  },
};
// ===== allowed keys =====
const allowedKeys = [
  "boundary", // 0
  "highway", // 1
  "waterway", // 2
  "aerialway", // 3
  "railway", // 4
  "aeroway", // 5
  "building", // 6
  "name", // 7
  "layer", // 8
  "water", // 9
  "natural", // 10
  "service", // 11
  "power", // 12
  "landuse", // 13
  "amenity", // 14
  "leisure", // 15
  "barrier", // 16
  "place", // 17
  "office", // 18
  "wall", // 19
  "golf", // 20
  "noexit", // 21
  "traffic_calming", // 22
  "shop", // 23
  "meadow", // 24
  "embankment", // 25
  "man_made", // 26
  "source", // 27
  "route", // 28
  "bridge", // 29
  "tourism", // 30
  "historic", // 31
  "public_transport", // 32
  "military", // 33
  "indoor", // 34
  "industrial", // 35
  "advertising", // 36
  "cemetery", // 37
];

// ================= DB =================
const db = new Database(DB_PATH, { readonly: true });

const queryAll = db.prepare(`
  SELECT osm_id, name, label, tag, geomType, geomCoordinates
  FROM places
  WHERE maxLat >= ? AND minLat <= ? AND maxLng >= ? AND minLng <= ?
  LIMIT ?
`);

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

function tileToBBox(z, x, y) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  const n2 = Math.PI - (2 * Math.PI * (y + 1)) / Math.pow(2, z);
  return {
    minLng: (x / Math.pow(2, z)) * 360 - 180,
    maxLng: ((x + 1) / Math.pow(2, z)) * 360 - 180,
    minLat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n2) - Math.exp(-n2))),
    maxLat: (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))),
  };
}

const qr8 = `WITH ranked AS (
        SELECT *,
          CASE
            WHEN geomType IN ('Polygon','MultiPolygon') THEN area
            WHEN geomType IN ('LineString','MultiLineString') THEN lineLength
            ELSE 0
          END AS score,

          CASE
            WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
            WHEN (highway IN ('motorway','trunk')) THEN 'highway'
            WHEN (water IN ('river','lake')) THEN 'water'
          END AS grp,

          ROW_NUMBER() OVER (
            PARTITION BY 
              CASE
                WHEN (label=0 AND admin_level IN ('2','4')) THEN 'label'
                WHEN (highway IN ('motorway','trunk')) THEN 'highway'
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
        WHERE NOT (maxLat < ? 
              OR minLat > ? 
              OR maxLng < ? 
              OR minLng > ?)
          AND (
            (label=0 AND admin_level IN ('2','4'))
            OR (highway IN ('motorway','trunk'))
            OR (water IN ('river','lake'))
          )
      )

      SELECT *
      FROM ranked
      WHERE rn <= 100;`;
// zoom-sqls.js
const ZOOM_SQLS = {
  0: null,
  1: null,
  2: null,
  3: `SELECT *
     FROM places
     WHERE NOT (maxLat < ? 
            OR minLat > ? 
            OR maxLng < ? 
            OR minLng > ?)
       AND (label=0)
     LIMIT 999999`,
  4: `SELECT *
     FROM places
     WHERE NOT (maxLat < ? 
            OR minLat > ? 
            OR maxLng < ? 
            OR minLng > ?)
       AND (label=0 and admin_level in ('2','4'))
     LIMIT 99999`,
  5: `SELECT *
     FROM places
     WHERE NOT (maxLat < ? 
            OR minLat > ? 
            OR maxLng < ? 
            OR minLng > ?)
       AND (label=0 and admin_level in ('2','4'))
     LIMIT 999999`,
  6: qr8,
  7: qr8,
  8: qr8,
  9: qr8,
  10: qr8,
  11: qr8,
  12: qr8,
  13: null,
  14: null,
};
function queryByZoomSQL(bbox, zoom, limit = 999) {
  const zoomSql = ZOOM_SQLS[zoom];

  if (zoomSql) {
    return db
      .prepare(zoomSql)
      .bind(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng)
      .all();
  }
  // all features
  return db
    .prepare(
      `
      SELECT osm_id, name, label, tag, geomType, geomCoordinates
      FROM places
      WHERE NOT (maxLat < ${bbox.minLat} 
             OR minLat > ${bbox.maxLat} 
             OR maxLng < ${bbox.minLng} 
             OR minLng > ${bbox.maxLng})
      LIMIT ${limit}
    `
    )
    .bind(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng)
    .all();
}

const MAX_ZOOM = 16;
const MIN_ZOOM = 6;

function getFeaturesForTile(z, x, y) {
  const start = Date.now();
  const bbox = tileToBBox(z, x, y);

  // ===== Query SQLite =====
  const t1 = Date.now();
  const rows = queryByZoomSQL(bbox, z);
  const t2 = Date.now();
  // console.log(
  //   `getFeaturesForTile:🟡 Tile z${z} x${x} y${y} | Query rows: ${
  //     rows.length
  //   } | time: ${t2 - t1}ms`
  // );

  const features = [];
  const t3 = Date.now();
  for (const row of rows) {
    try {
      const feature = {
        type: "Feature",
        properties: {
          ...row.properties,
          label: allowedKeys[row.label] || "unknown",
        },
        geometry: {
          type: row.geomType,
          coordinates: JSON.parse(row.geomCoordinates),
        },
      };

      // const tol = SIMPLIFY_CONFIG.tolerance[z] || 1;
      // const simplified = simplify(feature, {
      //   tolerance: tol,
      //   highQuality: true, // giữ line liên tục
      //   mutate: false,
      // });

      features.push(feature);
    } catch (e) {
      console.error(
        `pickTopNPerLabel:❌ Error processing feature: ${e.message}`
      );
    }
  }
  const t4 = Date.now();
  // console.log(
  //   `  pickTopNPerLabel:Parsed & simplified features: ${
  //     features.length
  //   } | time: ${t4 - t3}ms`
  // );

  // ===== pick top N =====
  // if (z <= 8) {
  //   // const t5 = Date.now();
  //   const topFeatures = pickTopNPerLabel(features, 200);
  //   // const t6 = Date.now();
  //   // console.log(
  //   //   `  pickTopNPerLabel:result: ${topFeatures.length} | time: ${t6 - t5}ms`
  //   // );
  //   console.log(`🔹 Total getFeaturesForTile: ${Date.now() - start}ms`);
  //   return topFeatures;
  // }

  console.log(`🔹 Total getFeaturesForTile: ${Date.now() - start}ms`);
  return features;
}
// ================= WRITE TILE =================
function writeTile(z, x, y) {
  const start = Date.now();
  console.log(`🟢 Start tile z${z} x${x} y${y}`);

  // ===== Get features =====
  // const t1 = Date.now();
  const features = getFeaturesForTile(z, x, y);
  const t2 = Date.now();
  // console.log(
  //   `  Features fetched: ${features.length} | time: ${(t2 - t1).toFixed(1)}ms`
  // );
  if (!features.length) return;

  // ===== Create geojson-vt index =====
  const tileIndex = geojsonVt(
    { type: "FeatureCollection", features },
    {
      maxZoom: 14,
      indexMaxPoints: 5000,
      tolerance: 0,
      extent: 4096,
      buffer: 64,
    }
  );

  // ===== Get tile =====
  const tile = tileIndex.getTile(z, x, y);
  if (!tile) return;

  // ===== Write file =====
  const dir = path.join(OUTPUT_DIR, String(z), String(x));
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(
    path.join(dir, `${y}.pbf`),
    vtPbf.fromGeojsonVt({ vietnam: tile })
  );
  const t8 = Date.now();
  console.log(`  Tile written | time: ${(t8 - t2).toFixed(1)}ms`);

  const total = (t8 - start).toFixed(1);
  console.log(`✅ Finished tile z${z} x${x} y${y} | total: ${total}ms\n`);
}

// ================= MAIN =================
const resultFile = path.join(__dirname, "result_mvt.txt");

// Xóa file cũ nếu tồn tại
if (fs.existsSync(resultFile)) fs.unlinkSync(resultFile);

// ================= MAIN =================
console.log("🚀 Generating MVT tiles...");

for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
  const zoomStart = Date.now();
  const { xMin, xMax, yMin, yMax } = getTileRange(z);

  console.log(`Zoom ${z}...`);

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      writeTile(z, x, y);
    }
  }

  const zoomEnd = Date.now();
  const timeMs = zoomEnd - zoomStart;
  const line = `Zoom ${z}: ${timeMs} ms\n`;

  // Ghi vào file
  fs.appendFileSync(resultFile, line);
  console.log(`⏱️ Zoom ${z} finished in ${timeMs} ms`);
}

console.log("✅ DONE");
db.close();
