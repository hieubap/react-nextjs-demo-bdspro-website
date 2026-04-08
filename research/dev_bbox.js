const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

// ===== CONFIG =====
const DB_PATH = path.join(__dirname, "sqlite/data/vietnam_v4.db");
const OUTPUT_STYLE = path.join(__dirname, "data/style.json");

const PBF_URL = "http://192.168.100.76:8002/v1/map/layer/tiles/{z}/{x}/{y}";

// ===== DB =====
const db = new Database(DB_PATH, { readonly: true });

const rows = db.prepare(`
  SELECT DISTINCT label, geomType 
  FROM places 
  WHERE label IS NOT NULL 
    AND geomType IS NOT NULL
`).all();

db.close();

// ===== GROUP LABELS =====
const groups = {
  point: new Set(),
  line: new Set(),
  polygon: new Set(),
};

rows.forEach(({ label, geomType }) => {
  const gt = geomType.toLowerCase();

  if (gt.includes("point")) groups.point.add(label);
  else if (gt.includes("line")) groups.line.add(label);
  else groups.polygon.add(label);
});

// convert Set → Array
const pointLabels = [...groups.point];
const lineLabels = [...groups.line];
const polygonLabels = [...groups.polygon];

// ===== STYLE HELPERS =====
const filterByLabels = (labels) => [
  "in",
  ["get", "label"],
  ["literal", labels],
];

// ===== BUILD LAYERS =====
const layers = [];

// ===== background =====
layers.push({
  id: "background",
  type: "background",
  paint: { "background-color": "#f8f4eb" },
});

// ===== POLYGON =====
layers.push({
  id: "polygon",
  type: "fill",
  source: "vietnam",
  "source-layer": "layer",
  minzoom: 5,
  filter: filterByLabels(polygonLabels),
  paint: {
    "fill-color": "#27ae60",
    "fill-opacity": 0.4,
    "fill-outline-color": "#2ecc71",
    "fill-antialias": false
  },
});

// ===== LINE =====
layers.push({
  id: "line",
  type: "line",
  source: "vietnam",
  "source-layer": "layer",
  minzoom: 6,
  filter: filterByLabels(lineLabels),
  layout: {
    "line-cap": "round",
    "line-join": "round",
  },
  paint: {
    "line-color": "#2980b9",
    "line-width": [
      "interpolate",
      ["linear"],
      ["zoom"],
      6, 0.5,
      10, 1.5,
      14, 3
    ],
    "line-opacity": 0.9,
  },
});

// ===== POINT =====
layers.push({
  id: "point",
  type: "circle",
  source: "vietnam",
  "source-layer": "layer",
  minzoom: 9,
  filter: filterByLabels(pointLabels),
  paint: {
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      9, 2,
      14, 5
    ],
    "circle-color": "#e74c3c",
    "circle-stroke-color": "#ffffff",
    "circle-stroke-width": 1,
    "circle-opacity": 0.9,
  },
});

// ===== STYLE JSON =====
const styleJson = {
  version: 8,
  name: "Vietnam Optimized Style",

  center: [105.8, 21.0],
  zoom: 5,

  sources: {
    vietnam: {
      type: "vector",
      tiles: [PBF_URL],
      minzoom: 0,
      maxzoom: 14,
      tileSize: 512 // 🔥 QUAN TRỌNG
    }
  },

  layers
};

// ===== WRITE FILE =====
fs.mkdirSync(path.dirname(OUTPUT_STYLE), { recursive: true });
fs.writeFileSync(OUTPUT_STYLE, JSON.stringify(styleJson, null, 2));

console.log("✅ Style optimized generated!");
console.log("Layers:", layers.length);