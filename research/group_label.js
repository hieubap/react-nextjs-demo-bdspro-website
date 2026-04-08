// ===== extract-level1-keys.js =====
const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join(__dirname, "data/metadata-grouped.json");
const OUTPUT_PATH = path.join(__dirname, "data/level1-keys.json");

const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));

const keys = raw.map((item) => item.key).sort();

console.log(`✅ Total level1 keys: ${keys.length}`);
console.log("Sample:", keys.slice(0, 10));

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(keys, null, 2));
console.log(`💾 Saved to ${OUTPUT_PATH}`);