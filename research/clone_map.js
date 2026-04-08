const fs = require("fs");
const path = require("path");
const axios = require("axios");

// ================= CONFIG =================
const OUTPUT_DIR = path.join(__dirname, "tiles_world");

// 🔥 URL tile server
const TILE_URL = "https://mapv3.meeymap.com/data/vietnam-latest-v28/{z}/{x}/{y}.pbf";

const MIN_ZOOM = 4;
const MAX_ZOOM = 8;

const CONCURRENCY = 20;
const RETRY = 2;

// 🌍 WORLD BBOX
const BBOX = {
  minLat: -85.0511,
  maxLat: 85.0511,
  minLng: -180,
  maxLng: 180,
};

// ================= UTILS =================
function lngToTileX(lng, z) {
  return Math.floor(((lng + 180) / 360) * Math.pow(2, z));
}

function latToTileY(lat, z) {
  const rad = (lat * Math.PI) / 180;
  return Math.floor(
    ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) *
      Math.pow(2, z)
  );
}

function getTileRange(z) {
  return {
    xMin: lngToTileX(BBOX.minLng, z),
    xMax: lngToTileX(BBOX.maxLng, z),
    yMin: latToTileY(BBOX.maxLat, z),
    yMax: latToTileY(BBOX.minLat, z),
  };
}

// ================= DOWNLOAD =================
async function downloadTile(z, x, y, retry = 0) {
  const url = TILE_URL
    .replace("{z}", z)
    .replace("{x}", x)
    .replace("{y}", y);

  const dir = path.join(OUTPUT_DIR, String(z), String(x));
  const filePath = path.join(dir, `${y}.pbf`);

  if (fs.existsSync(filePath)) return;

  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 10000,
    });

    if (!res.data || res.data.length === 0) return;

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, res.data);

  } catch (err) {
    if (retry < RETRY) {
      return downloadTile(z, x, y, retry + 1);
    }
  }
}

// ================= POOL =================
async function runPool(tasks, limit) {
  const executing = new Set();

  for (const task of tasks) {
    const p = task();
    executing.add(p);

    p.finally(() => executing.delete(p));

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
}

// ================= MAIN =================
async function main() {
  console.log("🌍 Start downloading WORLD tiles...");

  let total = 0;
  let done = 0;

  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    const { xMin, xMax, yMin, yMax } = getTileRange(z);
    const count = (xMax - xMin + 1) * (yMax - yMin + 1);

    console.log(`Zoom ${z} → ${count} tiles`);
    total += count;
  }

  console.log(`📦 Total tiles: ${total}`);

  const tasks = [];

  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    const { xMin, xMax, yMin, yMax } = getTileRange(z);

    for (let x = xMin; x <= xMax; x++) {
      for (let y = yMin; y <= yMax; y++) {

        tasks.push(async () => {
          await downloadTile(z, x, y);
          done++;

          if (done % 1000 === 0) {
            console.log(`✅ ${done}/${total}`);
          }
        });

      }
    }
  }

  await runPool(tasks, CONCURRENCY);

  console.log("🎉 DONE WORLD");
}

main();