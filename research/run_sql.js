// ===== test-places.js =====
const Database = require("better-sqlite3");
const path = require("path");

// ===== Config DB =====
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v7.db");
const db = new Database(DB_PATH, { readonly: true });

function runSQL(sql, params = []) {
  try {
    const stmt = db.prepare(sql);
    const rows = stmt.all(...params);

    console.log("\n🧾 SQL:", sql);
    console.log("📦 Params:", params);
    console.log(`📊 Rows: ${rows.length}\n`);

    rows.forEach((row, i) => {
      console.log(`🔹 Row ${i + 1}:`);
      console.dir(row, { depth: null });
    });

    return rows;
  } catch (err) {
    console.error("❌ SQL Error:", err.message);
  }
}

runSQL(`
  SELECT properties, admin_level, geomType
  FROM places 
  WHERE (highway in ('primary','secondary','tertiary'))
  LIMIT 100
`, []);

db.close();
