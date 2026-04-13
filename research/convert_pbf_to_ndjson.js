const fs = require("fs");
const Pbf = require("pbf").default;
const { VectorTile } = require("@mapbox/vector-tile");
const path = require("path");

const p = path.join(__dirname, `./16_52026_28849.pbf`);
const outP = path.join(__dirname, `./output.ndjson`);
const importedFile = path.join(__dirname, `./imported.txt`);

const fileName = path.basename(p, ".pbf");
const [z, x, y] = fileName.split("_").map(Number);

// 👉 check flag
const isClear = process.argv.includes("--clear");

const buffer = fs.readFileSync(p);
const tile = new VectorTile(new Pbf(buffer));

// 👉 nếu clear thì xóa file trước
if (isClear) {
  fs.writeFileSync(outP, ""); // clear NDJSON
  fs.writeFileSync(importedFile, ""); // clear imported.txt
  console.log("🧹 Cleared output files");
}

// 👉 stream NDJSON (append mode)
const stream = fs.createWriteStream(outP, {
  flags: "a", // 👈 append
});

for (const layerName in tile.layers) {
  const layer = tile.layers[layerName];

  for (let i = 0; i < layer.length; i++) {
    const feature = layer.feature(i);
    const geojson = feature.toGeoJSON(x, y, z);

    stream.write(
      JSON.stringify({
        ...geojson,
        properties: {
          ...geojson.properties,
          layer: layerName,
        },
      }) + "\n"
    );
  }
}

stream.end();

console.log("✅ NDJSON written:", outP);

//
// 🔥 WRITE imported.txt (unique z,x,y)
//

const newLine = `${z},${x},${y}`;

let lines = [];
if (!isClear && fs.existsSync(importedFile)) {
  const content = fs.readFileSync(importedFile, "utf-8");
  lines = content.split("\n").filter(Boolean);
}

const set = new Set(lines);

if (!set.has(newLine)) {
  fs.appendFileSync(importedFile, newLine + "\n");
  console.log("✅ Added:", newLine);
} else {
  console.log("⚠️ Already exists:", newLine);
}