const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "imported.txt");
const outFile = path.join(__dirname, "tiles.geojson");

// 👉 convert tile → lng
function tile2lng(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

// 👉 convert tile → lat
function tile2lat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

// 👉 đọc file
const content = fs.readFileSync(inputFile, "utf-8");
const lines = content.split("\n").filter(Boolean);

const features = [];

for (const line of lines) {
  const [z, x, y] = line.split(",").map(Number);

  // 4 góc tile
  const west = tile2lng(x, z);
  const east = tile2lng(x + 1, z);
  const north = tile2lat(y, z);
  const south = tile2lat(y + 1, z);

  const polygon = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [west, north],
        [east, north],
        [east, south],
        [west, south],
        [west, north],
      ]],
    },
    properties: {
      z,
      x,
      y,
    },
  };

  features.push(polygon);
}

// 👉 ghi geojson
const geojson = {
  type: "FeatureCollection",
  features,
};

fs.writeFileSync(outFile, JSON.stringify(geojson));

console.log("✅ Generated tiles.geojson");