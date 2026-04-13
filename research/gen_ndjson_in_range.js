const fs = require("fs");
const path = require("path");
const Pbf = require("pbf").default;
const { VectorTile } = require("@mapbox/vector-tile");

// ===== CONFIG =====
const TILE_URL = "http://14.225.210.29:8002/v1/map/mid/rt_toanquoc"; // 👉 sửa domain

const baseZ = 16;
const baseX = 52023;//52047
const baseY = 28838;//28873

const rangeX = 24;
const rangeY = 35;

// ===== FILE =====
const outP = path.join(__dirname, "output.ndjson");
const importedFile = path.join(__dirname, "imported.txt");

// ===== FLAG =====
const isClear = process.argv.includes("--clear");

// ===== INIT =====
if (isClear) {
  fs.writeFileSync(outP, "");
  fs.writeFileSync(importedFile, "");
  console.log("🧹 Cleared output.ndjson & imported.txt");
}

// append mode
const stream = fs.createWriteStream(outP, { flags: "a" });

// load imported set
let importedSet = new Set();
if (!isClear && fs.existsSync(importedFile)) {
  const content = fs.readFileSync(importedFile, "utf-8");
  importedSet = new Set(content.split("\n").filter(Boolean));
}

// ===== FETCH TILE =====
async function fetchTile(z, x, y) {
  const url = `${TILE_URL}/${z}/${x}/${y}.pbf`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.log("❌ HTTP:", res.status, url);
      return null;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    return buf;
  } catch (err) {
    console.log("❌ Fetch fail:", url);
    return null;
  }
}

// ===== PROCESS TILE =====
async function processTile(z, x, y) {
  const key = `${z},${x},${y}`;

  if (importedSet.has(key)) {
    console.log("⏭ Skip:", key);
    return;
  }

  console.log("🌐 Fetch:", key);

  const buffer = await fetchTile(z, x, y);
  if (!buffer) return;

  const tile = new VectorTile(new Pbf(buffer));

  let count = 0;

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
            z,
            x,
            y,
          },
        }) + "\n"
      );

      count++;
    }
  }

  // 👉 ghi imported
  fs.appendFileSync(importedFile, key + "\n");
  importedSet.add(key);

  console.log(`✅ Done ${key} (${count} features)`);
}

// ===== MAIN =====
async function main() {
  for (let dx = 0; dx <= rangeX; dx++) {
    for (let dy = 0; dy <= rangeY; dy++) {
      const z = baseZ;
      const x = baseX + dx;
      const y = baseY + dy;

      await processTile(z, x, y); // 👉 chạy tuần tự (safe)
    }
  }

  stream.end();
  console.log("🎉 ALL DONE");
}

main();