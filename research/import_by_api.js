const fs = require("fs");
const readline = require("readline");
const axios = require("axios");
const path = require("path");

const INPUT = path.join(__dirname, `./output.ndjson`);
const BATCH_SIZE = 1000;
const API_URL = "http://localhost:8000/v2/tqd/parcels/batch";

// 👉 tính centroid đơn giản (cho Polygon)
function getCentroid(coords) {
  let sumX = 0;
  let sumY = 0;
  let count = 0;

  coords.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      sumX += lng;
      sumY += lat;
      count++;
    });
  });

  return {
    lat: sumY / count,
    lng: sumX / count,
  };
}

// 👉 bbox
function getBBox(coords) {
  let minLat = Infinity,
    minLng = Infinity,
    maxLat = -Infinity,
    maxLng = -Infinity;

  coords.forEach(ring => {
    ring.forEach(([lng, lat]) => {
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });
  });

  return { minLat, minLng, maxLat, maxLng };
}

// 👉 convert feature → Parcel
function convertFeature(feature, id) {
  const geometry = feature.geometry;

  if (!geometry || !geometry.coordinates) return null;

  let coords = [];

  if (geometry.type === "Polygon") {
    coords = geometry.coordinates;
  } else if (geometry.type === "MultiPolygon") {
    coords = geometry.coordinates.flat();
  } else {
    return null; // bỏ qua loại khác
  }

  const { lat, lng } = getCentroid(coords);
  const { minLat, minLng, maxLat, maxLng } = getBBox(coords);

  return {
    id,
    name: "",
    latitude: lat,
    longitude: lng,

    // 👇 bytes → base64 (quan trọng)
    geometry: Buffer.from(JSON.stringify(geometry)).toString("base64"),

    minLat,
    minLng,
    maxLat,
    maxLng,
  };
}

async function run() {
  const rl = readline.createInterface({
    input: fs.createReadStream(INPUT),
    crlfDelay: Infinity,
  });

  let batch = [];
  let id = 1;

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const feature = JSON.parse(line);
      const parcel = convertFeature(feature, id++);

      if (!parcel) continue;

      batch.push(parcel);

      if (batch.length >= BATCH_SIZE) {
        await sendBatch(batch);
        batch = [];
      }
    } catch (err) {
      console.error("Parse error:", err);
    }
  }

  // gửi batch cuối
  if (batch.length > 0) {
    await sendBatch(batch);
  }

  console.log("DONE ✅");
}

// 👉 gọi API
async function sendBatch(data) {
  try {
    await axios.post(API_URL, {
      data,
    });
    console.log(`Sent batch: ${data.length}`);
  } catch (err) {
    console.error("API error:", err.message);
  }
}

run();