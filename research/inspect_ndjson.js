// ===== build-key-values-map.js =====
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const GEOJSON_PATH = path.join(__dirname, "data/vietnam.ndjson");
const OUTPUT_PATH = path.join(__dirname, "key_values_map.json");

(async () => {
  const start = Date.now();
  const keyValuesMap = {}; // { key: Set(values) }

  const rl = readline.createInterface({
    input: fs.createReadStream(GEOJSON_PATH, { highWaterMark: 1024 * 1024 * 16 }),
    crlfDelay: Infinity,
  });

  let count = 0;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const feature = JSON.parse(line);
      const props = feature.properties || {};

      for (const [k, v] of Object.entries(props)) {
        if (v == null) continue;
        if (!keyValuesMap[k]) keyValuesMap[k] = new Set();
        // Nếu value là array hoặc object thì convert sang string
        if (typeof v === "object") keyValuesMap[k].add(JSON.stringify(v));
        else keyValuesMap[k].add(String(v));
      }

      count++;
      if (count % 100000 === 0) {
        process.stdout.write(`\r⏳ Processed ${count} features`);
      }
    } catch (err) {
      console.error("❌ JSON parse error:", err);
    }
  }

  // Chuyển Set → Array để ghi ra JSON
  const output = {};
  for (const [k, set] of Object.entries(keyValuesMap)) {
    output[k] = Array.from(set).sort(); // sort cho đẹp
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✅ Done! Processed ${count} features in ${elapsed}s`);
  console.log(`🔗 Output saved to: ${OUTPUT_PATH}`);
})();