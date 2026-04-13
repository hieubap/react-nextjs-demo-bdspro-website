const fs = require("fs");
const Pbf = require("pbf").default;
const { VectorTile } = require("@mapbox/vector-tile");
const path = require("path");

const p = path.join(__dirname, `./16_52027_28851.pbf`);
const outP = path.join(__dirname, `./output.geojson`);
const importedFile = path.join(__dirname, `./imported.txt`);

const fileName = path.basename(p, ".pbf");
const [z, x, y] = fileName.split("_").map(Number);

const buffer = fs.readFileSync(p);
const tile = new VectorTile(new Pbf(buffer));

const features = [];

for (const layerName in tile.layers) {
  const layer = tile.layers[layerName];

  for (let i = 0; i < layer.length; i++) {
    const feature = layer.feature(i);
    const geojson = feature.toGeoJSON(x, y, z);

    features.push({
      ...geojson,
      properties: {
        ...geojson.properties,
        layer: layerName,
      },
    });
  }
}

// 👉 ghi GeoJSON
const geojson = {
  type: "FeatureCollection",
  features,
};

fs.writeFileSync(outP, JSON.stringify(geojson));

//
// 🔥 WRITE imported.txt (unique z,x,y)
//

const newLine = `${z},${x},${y}`;

// đọc file cũ
let lines = [];
if (fs.existsSync(importedFile)) {
  const content = fs.readFileSync(importedFile, "utf-8");
  lines = content.split("\n").filter(Boolean);
}

// dùng set chống trùng
const set = new Set(lines);

if (!set.has(newLine)) {
  set.add(newLine);

  fs.writeFileSync(
    importedFile,
    Array.from(set).join("\n") + "\n"
  );

  console.log("✅ Added:", newLine);
} else {
  console.log("⚠️ Already exists:", newLine);
}