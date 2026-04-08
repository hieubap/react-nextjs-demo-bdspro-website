#!/usr/bin/env node
/**
 * GeoJSON Large File Analyzer (Streaming)
 * Đọc file GeoJSON lớn (vài GB) mà không bị crash memory.
 * Sử dụng: node analyze-geojson.js <path-to-file.geojson>
 *
 * Output: in kết quả ra console + ghi file report-data.json
 */

const fs = require("fs");
const path = require("path");
const { Transform } = require("stream");

const filePath = process.argv[2];
if (!filePath) {
  console.error("Cách dùng: node analyze-geojson.js <path-to-file.geojson>");
  process.exit(1);
}

const absPath = path.resolve(filePath);
if (!fs.existsSync(absPath)) {
  console.error(`Không tìm thấy file: ${absPath}`);
  process.exit(1);
}

const fileSizeBytes = fs.statSync(absPath).size;
const fileSizeMB = (fileSizeBytes / 1024 / 1024).toFixed(2);

console.log(`\n📂 File: ${absPath}`);
console.log(`📦 Kích thước: ${fileSizeMB} MB\n`);
console.log("⏳ Đang phân tích... (có thể mất vài phút với file lớn)\n");

// ─── Progress bar renderer ────────────────────────────────────────────────────
const startTime = Date.now();
let lastBytes = 0;
let lastTime = Date.now();
let speedSamples = []; // rolling window for speed avg

function renderProgress(bytesRead, features, done = false) {
  const now = Date.now();
  const pct = Math.min((bytesRead / fileSizeBytes) * 100, 100);
  const elapsed = (now - startTime) / 1000;

  // Speed (MB/s) — rolling avg over last 5 samples
  const dt = (now - lastTime) / 1000;
  if (dt > 0.3) {
    const speedNow = (bytesRead - lastBytes) / 1024 / 1024 / dt;
    speedSamples.push(speedNow);
    if (speedSamples.length > 5) speedSamples.shift();
    lastBytes = bytesRead;
    lastTime = now;
  }
  const speed = speedSamples.length
    ? speedSamples.reduce((a, b) => a + b) / speedSamples.length
    : 0;

  // ETA
  const remaining =
    speed > 0 ? (fileSizeBytes - bytesRead) / 1024 / 1024 / speed : 0;
  const etaStr = done
    ? "Xong!"
    : remaining > 60
    ? `${(remaining / 60).toFixed(1)} phút`
    : `${remaining.toFixed(0)} giây`;

  // Bar — 35 chars wide
  const barWidth = 35;
  const filled = Math.round((pct / 100) * barWidth);
  const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);

  const readMB = (bytesRead / 1024 / 1024).toFixed(1);
  const elapsedStr =
    elapsed < 60 ? `${elapsed.toFixed(0)}s` : `${(elapsed / 60).toFixed(1)}m`;

  process.stdout.clearLine?.(0);
  process.stdout.cursorTo?.(0);
  process.stdout.write(
    `  [${bar}] ${pct.toFixed(1)}%` +
      `  ${readMB}/${fileSizeMB}MB` +
      `  ⚡${speed.toFixed(1)}MB/s` +
      `  ⏱${elapsedStr}` +
      `  ⌛${etaStr}` +
      `  📍${features.toLocaleString()} features`
  );
}

// ─── Stats collectors ────────────────────────────────────────────────────────
const stats = {
  totalFeatures: 0,
  geometryTypes: {},
  propertyKeys: {},
  propertyValueSamples: {}, // first 5 unique values per key
  bbox: {
    minLon: Infinity,
    maxLon: -Infinity,
    minLat: Infinity,
    maxLat: -Infinity,
  },
  nullGeometries: 0,
  coordinateCounts: { total: 0, min: Infinity, max: -Infinity },
  errors: [],
  topLevelType: null,
  crs: null,
};

// ─── Coordinate helpers ──────────────────────────────────────────────────────
function updateBbox(coords) {
  if (!Array.isArray(coords)) return;
  if (typeof coords[0] === "number") {
    const [lon, lat] = coords;
    if (lon < stats.bbox.minLon) stats.bbox.minLon = lon;
    if (lon > stats.bbox.maxLon) stats.bbox.maxLon = lon;
    if (lat < stats.bbox.minLat) stats.bbox.minLat = lat;
    if (lat > stats.bbox.maxLat) stats.bbox.maxLat = lat;
  } else {
    coords.forEach(updateBbox);
  }
}

function countCoords(coords) {
  if (!Array.isArray(coords)) return 0;
  if (typeof coords[0] === "number") return 1;
  return coords.reduce((sum, c) => sum + countCoords(c), 0);
}

// ─── Process one feature ─────────────────────────────────────────────────────
function processFeature(feature) {
  stats.totalFeatures++;

  // Geometry
  const geom = feature.geometry;
  if (!geom) {
    stats.nullGeometries++;
  } else {
    const type = geom.type || "Unknown";
    stats.geometryTypes[type] = (stats.geometryTypes[type] || 0) + 1;

    if (geom.coordinates) {
      updateBbox(geom.coordinates);
      const cnt = countCoords(geom.coordinates);
      stats.coordinateCounts.total += cnt;
      if (cnt < stats.coordinateCounts.min) stats.coordinateCounts.min = cnt;
      if (cnt > stats.coordinateCounts.max) stats.coordinateCounts.max = cnt;
    }
  }

  // Properties
  const props = feature.properties || {};
  Object.entries(props).forEach(([key, val]) => {
    stats.propertyKeys[key] = (stats.propertyKeys[key] || 0) + 1;

    if (!stats.propertyValueSamples[key]) {
      stats.propertyValueSamples[key] = new Set();
    }
    if (
      stats.propertyValueSamples[key].size < 5 &&
      val !== null &&
      val !== undefined
    ) {
      stats.propertyValueSamples[key].add(String(val).slice(0, 80));
    }
  });
}

// ─── Streaming JSON parser ───────────────────────────────────────────────────
// Dùng thuật toán tìm object boundaries thay vì parse toàn bộ file
let buffer = "";
let depth = 0;
let inString = false;
let escape = false;
let featureStart = -1;
let headerParsed = false;
let bytesRead = 0;

const readStream = fs.createReadStream(absPath, {
  encoding: "utf8",
  highWaterMark: 4 * 1024 * 1024,
});

// Parse header để lấy top-level type, crs
function parseHeader(chunk) {
  const combined = buffer + chunk;
  const typeMatch = combined.match(/"type"\s*:\s*"([^"]+)"/);
  if (typeMatch) stats.topLevelType = typeMatch[1];

  const crsMatch = combined.match(/"crs"\s*:\s*\{[^}]+\}/);
  if (crsMatch) {
    const nameMatch = crsMatch[0].match(/"name"\s*:\s*"([^"]+)"/);
    if (nameMatch) stats.crs = nameMatch[1];
  }
}

function extractFeatures(chunk) {
  buffer += chunk;

  for (let i = 0; i < buffer.length; i++) {
    const ch = buffer[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (ch === "{") {
      if (depth === 0 && featureStart === -1) {
        // Tìm feature object ở depth 1 (bên trong "features": [...])
      }
      depth++;

      // Detect feature start: depth == 2 means inside the features array
      if (depth === 2 && featureStart === -1) {
        featureStart = i;
      }
    } else if (ch === "}") {
      depth--;
      if (depth === 1 && featureStart !== -1) {
        // Found a complete feature object
        const featureStr = buffer.slice(featureStart, i + 1);
        try {
          const feature = JSON.parse(featureStr);
          processFeature(feature);
        } catch (e) {
          stats.errors.push(
            `Parse error near feature ${
              stats.totalFeatures + 1
            }: ${e.message.slice(0, 80)}`
          );
        }
        featureStart = -1;
      }
    }
  }

  // Keep only unprocessed tail in buffer (avoid OOM)
  if (featureStart !== -1) {
    buffer = buffer.slice(featureStart);
    featureStart = 0;
  } else {
    // Keep last 512 chars in case we're mid-token
    buffer = buffer.slice(-512);
  }
}

readStream.on("data", (chunk) => {
  bytesRead += Buffer.byteLength(chunk, "utf8");
  const progress = Math.floor((bytesRead / fileSizeBytes) * 100);

  if (!headerParsed && bytesRead < 8192) {
    parseHeader(chunk);
    if (bytesRead >= 2048) headerParsed = true;
  }

  extractFeatures(chunk);

  renderProgress(bytesRead, stats.totalFeatures);
});

readStream.on("end", () => {
  renderProgress(fileSizeBytes, stats.totalFeatures, true);
  process.stdout.write("\n\n");
  printReport();
});

readStream.on("error", (err) => {
  console.error("Lỗi đọc file:", err.message);
  process.exit(1);
});

// ─── Print + save report ─────────────────────────────────────────────────────
function printReport() {
  const avgCoords =
    stats.totalFeatures > 0
      ? (stats.coordinateCounts.total / stats.totalFeatures).toFixed(1)
      : 0;

  const bboxValid = stats.bbox.minLon !== Infinity;

  const propertyKeysSorted = Object.entries(stats.propertyKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30);

  // Convert Set to Array for JSON
  const valueSamples = {};
  Object.entries(stats.propertyValueSamples).forEach(([k, v]) => {
    valueSamples[k] = [...v];
  });

  const report = {
    meta: {
      file: absPath,
      fileSizeMB: parseFloat(fileSizeMB),
      analyzedAt: new Date().toISOString(),
      topLevelType: stats.topLevelType,
      crs: stats.crs,
    },
    summary: {
      totalFeatures: stats.totalFeatures,
      nullGeometries: stats.nullGeometries,
      geometryTypes: stats.geometryTypes,
      parseErrors: stats.errors.length,
    },
    coordinates: {
      bbox: bboxValid
        ? {
            minLon: +stats.bbox.minLon.toFixed(6),
            maxLon: +stats.bbox.maxLon.toFixed(6),
            minLat: +stats.bbox.minLat.toFixed(6),
            maxLat: +stats.bbox.maxLat.toFixed(6),
          }
        : null,
      totalCoordinates: stats.coordinateCounts.total,
      avgPerFeature: parseFloat(avgCoords),
      minPerFeature:
        stats.coordinateCounts.min === Infinity
          ? 0
          : stats.coordinateCounts.min,
      maxPerFeature:
        stats.coordinateCounts.max === -Infinity
          ? 0
          : stats.coordinateCounts.max,
    },
    properties: {
      uniqueKeys: Object.keys(stats.propertyKeys).length,
      topKeys: propertyKeysSorted,
      valueSamples,
    },
    errors: stats.errors.slice(0, 20),
  };

  // Console output
  console.log("═══════════════════════════════════════════════════");
  console.log("              📊 KẾT QUẢ PHÂN TÍCH GEOJSON");
  console.log("═══════════════════════════════════════════════════");
  console.log(`\n📁 File size       : ${fileSizeMB} MB`);
  console.log(`📍 Loại GeoJSON    : ${stats.topLevelType || "Không xác định"}`);
  console.log(`🗺️  CRS             : ${stats.crs || "Mặc định (WGS84)"}`);
  console.log(`\n🔢 Tổng Features   : ${stats.totalFeatures.toLocaleString()}`);
  console.log(`⚠️  Null Geometry   : ${stats.nullGeometries}`);
  console.log(`🚨 Lỗi parse       : ${stats.errors.length}`);

  console.log("\n📐 Loại Geometry:");
  Object.entries(stats.geometryTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const pct = ((count / stats.totalFeatures) * 100).toFixed(1);
      console.log(
        `   ${type.padEnd(20)} : ${count.toLocaleString()} (${pct}%)`
      );
    });

  if (bboxValid) {
    console.log("\n🌐 Bounding Box:");
    console.log(
      `   Lon: ${stats.bbox.minLon.toFixed(6)} → ${stats.bbox.maxLon.toFixed(
        6
      )}`
    );
    console.log(
      `   Lat: ${stats.bbox.minLat.toFixed(6)} → ${stats.bbox.maxLat.toFixed(
        6
      )}`
    );
  }

  console.log("\n📌 Tọa độ:");
  console.log(
    `   Tổng điểm        : ${stats.coordinateCounts.total.toLocaleString()}`
  );
  console.log(`   Trung bình/feature: ${avgCoords}`);
  console.log(
    `   Min/Max          : ${
      stats.coordinateCounts.min === Infinity ? 0 : stats.coordinateCounts.min
    } / ${
      stats.coordinateCounts.max === -Infinity ? 0 : stats.coordinateCounts.max
    }`
  );

  console.log(
    `\n🏷️  Thuộc tính (${Object.keys(stats.propertyKeys).length} unique keys):`
  );
  propertyKeysSorted.slice(0, 15).forEach(([key, count]) => {
    const samples = valueSamples[key]
      ? valueSamples[key].slice(0, 3).join(", ")
      : "";
    console.log(
      `   "${key}"`.padEnd(30) +
        ` : ${count.toLocaleString()} features | Ví dụ: ${samples}`
    );
  });

  if (stats.errors.length > 0) {
    console.log("\n🚨 Lỗi (hiển thị tối đa 5):");
    stats.errors.slice(0, 5).forEach((e) => console.log("   " + e));
  }

  // Save JSON
  const outJson = path.join(path.dirname(absPath), "report-data.json");
  fs.writeFileSync(outJson, JSON.stringify(report, null, 2), "utf8");
  console.log(`\n✅ Đã lưu dữ liệu JSON: ${outJson}`);
  console.log(`   Mở file report.html để xem báo cáo trực quan.\n`);
}
