const fs = require("fs");
const path = require("path");
const { parser } = require("stream-json");
const { pick } = require("stream-json/filters/pick.js");
const { chain } = require("stream-chain");
const { streamArray } = require("stream-json/streamers/stream-array.js");

const GEOJSON_PATH = path.join(__dirname, "data/vietnam.geojson");
const OUTPUT_PATH = path.join(__dirname, "data/labels.json");

const keys = new Map();

const pipeline = chain([
  fs.createReadStream(GEOJSON_PATH, { highWaterMark: 24 * 1024 * 1024 }),
  parser({ streamValues: false }),
  pick({ filter: "features" }),
  streamArray(),
]);

let count = 0;
const start = Date.now();

pipeline.on("data", ({ value }) => {
  const props = value.properties;
  if (!props) return;

  for (const k in props) {
    keys.set(k, (keys.get(k) || 0) + 1);
  }

  count++;

  if ((count & 16383) === 0) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    process.stdout.write(`\r⏳ ${count} | ${elapsed}s`);
  }
});

pipeline.on("end", () => {
  console.log("\n💾 Writing file...");

  // convert Map → Object
  const obj = {};
  for (const [k, v] of keys) {
    obj[k] = v;
  }

  // sort theo count giảm dần
  const sorted = Object.fromEntries(
    Object.entries(obj).sort((a, b) => b[1] - a[1])
  );

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2));

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);

  console.log("✅ DONE");
  console.log(`📦 total: ${count}`);
  console.log(`⏱ Time: ${elapsed}s`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
});

pipeline.on("error", (err) => {
  console.error("❌ Stream error:", err);
});