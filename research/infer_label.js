const fs = require("fs");
const path = require("path");
const { parser } = require("stream-json");
const { pick } = require("stream-json/filters/pick.js");
const { chain } = require("stream-chain");
const { streamArray } = require("stream-json/streamers/stream-array.js");

const GEOJSON_PATH = path.join(__dirname, "data/vietnam.geojson");
const OUTPUT_PATH = path.join(__dirname, "data/good-labels.json");

// ===== Set các key hợp lệ =====
const allowedKeys = [
  "highway",
  "railway",
  "waterway",
  "aeroway",
  "aerialway",
  "building",
  "name",
  "layer",
  "natural",
  "service",
  "power",
  "landuse",
  "amenity",
  "boundary",
  "leisure",
  "barrier",
  "place",
//   "created_by",

  "water",
  "meadow",
  "embankment",
  "man_made",
  "source",
  "cemetery",
  "route",
  "bridge",
  "tourism",
  "historic",
//   "phone",
  "public_transport",
  "military",
  "indoor",
  "industrial",
  "office",
  "wall",
  "advertising",
  "golf",
  "noexit",
  "traffic_calming",
  "shop"
];

// ===== Stream pipeline =====
const pipeline = chain([
  fs.createReadStream(GEOJSON_PATH, { highWaterMark: 24 * 1024 * 1024 }),
  parser({ streamValues: false }),
  pick({ filter: "features" }),
  streamArray(),
]);

const outputStream = fs.createWriteStream(OUTPUT_PATH, { flags: "w" });

let count = 0;
let filteredCount = 0;
const start = Date.now();

pipeline.on("data", ({ value }) => {
  const props = value.properties;
  if (!props) return;

  // Kiểm tra xem có key nào ngoài set không
  // Kiểm tra xem feature có bất kỳ key nào trong set không
  const hasAnyKey = Object.keys(props).some((k) =>
    allowedKeys.some((allowed) => k.includes(allowed))
  );

  // Nếu không có key nào trong set → ghi ra file
  if (!!hasAnyKey) {
    outputStream.write(JSON.stringify(value) + "\n");
    filteredCount++;
  }

  count++;

  // log tiến trình nhanh hơn %
  if ((count & 16383) === 0) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    process.stdout.write(
      `\r⏳ Processed: ${count} | Filtered: ${filteredCount} | ${elapsed}s`
    );
  }
});

pipeline.on("end", () => {
  outputStream.end();
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`\n✅ DONE`);
  console.log(`📦 Total features: ${count}`);
  console.log(`📂 Filtered features: ${filteredCount}`);
  console.log(`⏱ Time: ${elapsed}s`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
});

pipeline.on("error", (err) => {
  console.error("❌ Stream error:", err);
  outputStream.end();
});
