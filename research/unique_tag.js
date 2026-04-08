// ===== group-metadata.js =====
const fs = require("fs");
const path = require("path");

const INPUT_PATH = path.join(__dirname, "data", "metadata.json");
const OUTPUT_PATH = path.join(__dirname, "data", "metadata-grouped.json");

const raw = JSON.parse(fs.readFileSync(INPUT_PATH, "utf8"));

const groupMap = new Map();

for (const item of raw) {
  const colonIdx = item.indexOf(":");
  if (colonIdx === -1) continue;

  const key = item.slice(0, colonIdx).trim();
  const rest = item.slice(colonIdx + 1).trim();

  if (!groupMap.has(key)) {
    groupMap.set(key, new Map());
  }

  // Tách cấp 2
  const colonIdx2 = rest.indexOf(":");
  if (colonIdx2 !== -1) {
    const subKey = rest.slice(0, colonIdx2).trim();
    const subValue = rest.slice(colonIdx2 + 1).trim();

    if (!groupMap.get(key).has(subKey)) {
      groupMap.get(key).set(subKey, new Set());
    }
    groupMap.get(key).get(subKey).add(subValue);
  } else {
    // Không có cấp 2 → subKey = "_", value = rest
    if (!groupMap.get(key).has("_")) {
      groupMap.get(key).set("_", new Set());
    }
    groupMap.get(key).get("_").add(rest);
  }
}

const grouped = [...groupMap.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([key, subMap]) => ({
    key,
    tags: [...subMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([subKey, values]) => ({
        key: subKey,
        values: [...values].sort(),
      })),
  }));

console.log(`✅ Total groups (level 1): ${grouped.length}`);
console.log(`📦 Total raw tags: ${raw.length}`);

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(grouped, null, 2));
console.log(`💾 Saved to ${OUTPUT_PATH}`);
