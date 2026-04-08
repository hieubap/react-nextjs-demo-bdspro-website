// ===== gen_style_from_sqlite.js =====
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

// ===== CONFIG =====
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v4.db");
const OUTPUT_STYLE = path.join(__dirname, "data/style.json");

const PBF_URL = "http://192.168.100.76:8002/v1/map/layer/tiles/{z}/{x}/{y}";

// ===== MỞ DATABASE =====
const db = new Database(DB_PATH, { readonly: true });

const rows = db.prepare(`
  SELECT DISTINCT label, geomType 
  FROM places 
  WHERE label IS NOT NULL 
    AND geomType IS NOT NULL
  ORDER BY 
    CASE 
      WHEN geomType IN ('polygon', 'multipolygon') THEN 1
      WHEN geomType IN ('line', 'linestring') THEN 2
      WHEN geomType IN ('point') THEN 3
      ELSE 4 
    END,
    label
`).all();

db.close();

// ===== TẠO ID DUY NHẤT =====
const seen = new Map();   // key = cleanId, value = counter

function getUniqueId(label, geomType) {
  let base = label.toLowerCase().trim().replace(/[^a-z0-9]/g, "_");
  let cleanId = `layer-${base}`;

  // Nếu trùng thì thêm hậu tố _2, _3, _4...
  if (seen.has(cleanId)) {
    let count = seen.get(cleanId) + 1;
    seen.set(cleanId, count);
    cleanId = `layer-${base}_${count}`;
  } else {
    seen.set(cleanId, 1);
  }

  return cleanId;
}

// ===== STYLE CONFIG THEO GEOMTYPE =====
function getLayerConfig(geomType) {
  const gt = geomType.toLowerCase().trim();

  if (gt === "point") {
    return {
      type: "circle",
      minzoom: 8,
      paint: {
        "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 3, 14, 7],
        "circle-color": "#e74c3c",
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1.5,
        "circle-opacity": 0.9,
      }
    };
  }

  if (gt === "line" || gt === "linestring") {
    return {
      type: "line",
      minzoom: 6,
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": "#2980b9",
        "line-width": ["interpolate", ["linear"], ["zoom"], 8, 1.5, 14, 4],
        "line-opacity": 0.9,
      }
    };
  }

  // polygon / multipolygon
  return {
    type: "fill",
    minzoom: 5,
    paint: {
      "fill-color": "#27ae60",
      "fill-opacity": 0.45,
      "fill-outline-color": "#2ecc71"
    }
  };
}

// ===== TẠO LAYERS =====
const layers = [];

// Background phải nằm đầu tiên
layers.push({
  id: "background",
  type: "background",
  paint: { "background-color": "#f8f4eb" }
});

// Tạo layer từ database
rows.forEach(({ label, geomType }) => {
  const id = `layer-${label}-${geomType}`;
  const config = getLayerConfig(geomType);
//   console.log(label,'label?');
  

  const layer = {
    id: id,
    type: config.type,
    source: "vietnam",
    "source-layer": "vietnam",
    minzoom: config.minzoom,
    layout: {
      visibility: "visible",
      ...(config.layout || {})
    },
    paint: config.paint || {}
  };

  layers.push(layer);
});

// ===== STYLE JSON =====
const styleJson = {
  version: 8,
  name: "Vietnam Custom Tiles Style",
  metadata: {
    "maplibre:version": "4.x",
    "generator": "gen_style_from_sqlite.js"
  },

  center: [105.8, 21.0],
  zoom: 10,

  sources: {
    vietnam: {
      type: "vector",
      tiles: [PBF_URL],
      minzoom: 0,
      maxzoom: 14
    }
  },

  layers: layers
};

// ===== GHI FILE =====
fs.mkdirSync(path.dirname(OUTPUT_STYLE), { recursive: true });
fs.writeFileSync(OUTPUT_STYLE, JSON.stringify(styleJson, null, 2));

console.log(`✅ Đã tạo style.json thành công!`);
console.log(`   Tổng layers: ${layers.length}`);
console.log(`   Output: ${OUTPUT_STYLE}`);
console.log(`   Đã xử lý duplicate ID (ví dụ layer-was)`);