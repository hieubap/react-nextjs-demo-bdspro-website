// ===== test-places.js =====
const Database = require("better-sqlite3");
const path = require("path");

// ===== Config DB =====
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v4.db");
const db = new Database(DB_PATH, { readonly: true });

// ===== Các hàm query =====
function getAll(limit = 100) {
  return db.prepare(`SELECT * FROM places LIMIT ?`).all(limit);
}

function getByLabel(label, limit = 100) {
  return db
    .prepare(`SELECT * FROM places WHERE label = ? LIMIT ?`)
    .all(label, limit);
}

function getByLabelTag(label, tag, limit = 100) {
  return db
    .prepare(`SELECT * FROM places WHERE label = ? AND tag = ? LIMIT ?`)
    .all(label, tag, limit);
}

function getByName(name, limit = 100) {
  return db
    .prepare(`SELECT * FROM places WHERE name LIKE ? LIMIT ?`)
    .all(`%${name}%`, limit);
}

function getByBBox({ minLat, maxLat, minLng, maxLng }, limit = 100) {
  return db
    .prepare(
      `
    SELECT * FROM places
    WHERE minLat >= ? AND maxLat <= ? AND minLng >= ? AND maxLng <= ?
    LIMIT ?
  `
    )
    .all(minLat, maxLat, minLng, maxLng, limit);
}

function query({ label, tag, name, bbox, geomType, limit = 100 } = {}) {
  const conditions = [];
  const params = [];

  if (label) {
    conditions.push("label = ?");
    params.push(label);
  }
  if (tag) {
    conditions.push("tag = ?");
    params.push(tag);
  }
  if (name) {
    conditions.push("name LIKE ?");
    params.push(`%${name}%`);
  }
  if (bbox) {
    conditions.push(
      "minLat >= ? AND maxLat <= ? AND minLng >= ? AND maxLng <= ?"
    );
    params.push(bbox.minLat, bbox.maxLat, bbox.minLng, bbox.maxLng);
  }
  if (geomType) {
    conditions.push("geomType = ?");
    params.push(geomType);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  params.push(limit);

  return db.prepare(`SELECT * FROM places ${where} LIMIT ?`).all(...params);
}

// ===== TEST =====
console.log("\n📋 1. Get 5 rows:");
console.log(getAll(5));

console.log("\n🏷️ 2. By label = highway:");
console.log(getByLabel("highway", 5));

console.log("\n🏷️ 3. By label = highway, tag = path:");
console.log(getByLabelTag("highway", "path", 5));

console.log("\n🔍 4. By name containing 'Hà Nội':");
console.log(getByName("Hà Nội", 5));

console.log("\n📍 5. By bbox (Hà Nội area):");
console.log(
  getByBBox({ minLat: 20.9, maxLat: 21.1, minLng: 105.7, maxLng: 105.9 }, 5)
);

console.log("\n🔎 6. Query kết hợp label + bbox:");
console.log(
  query({
    geomType: "LineString",
    // bbox: { minLat: 20.9, maxLat: 21.1, minLng: 105.7, maxLng: 105.9 },
    limit: 5,
  })
);

// ===== Query unique geomType =====
const rows = db.prepare(`
  SELECT DISTINCT geomType
  FROM places
`).all();

console.log("📌 Unique geomTypes found:");
rows.forEach((r, i) => {
  console.log(`${i + 1}. ${r.geomType}`);
});

db.close();
