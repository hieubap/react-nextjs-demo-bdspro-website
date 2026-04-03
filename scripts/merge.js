const fs = require('fs');
const turf = require('@turf/turf');

const data = require('../src/Screens/QHMapScreen/tinhVN');

const MIN_AREA = 500_000_000;

/**
 * extract polygon (giữ như cũ)
 */
function extractValidPolygon(feature) {
  if (!feature.geometry) return null;

  const { type, coordinates } = feature.geometry;

  try {
    if (type === 'Polygon') {
      const poly = turf.polygon(coordinates);
      if (turf.area(poly) > MIN_AREA) return poly;
    }

    if (type === 'MultiPolygon') {
      let maxPoly = null;
      let maxArea = 0;

      for (const coords of coordinates) {
        const poly = turf.polygon(coords);
        const area = turf.area(poly);

        if (area > maxArea) {
          maxArea = area;
          maxPoly = poly;
        }
      }

      if (maxArea > MIN_AREA) return maxPoly;
    }
  } catch {}

  return null;
}

/**
 * fix geometry
 */
function fixGeometry(feature) {
  try {
    let f = turf.cleanCoords(feature);
    f = turf.buffer(f, 0);
    return f;
  } catch {
    return null;
  }
}

/**
 * polygon → lines
 */
function polygonToLines(feature) {
  const lines = [];

  try {
    const boundary = turf.polygonToLine(feature);

    if (!boundary) return lines;

    if (boundary.geometry.type === 'LineString') {
      lines.push(boundary);
    }

    if (boundary.geometry.type === 'MultiLineString') {
      for (const coords of boundary.geometry.coordinates) {
        lines.push(turf.lineString(coords));
      }
    }
  } catch {}

  return lines;
}

/**
 * normalize để remove duplicate
 */
function normalize(coords) {
  const a = JSON.stringify(coords);
  const b = JSON.stringify([...coords].reverse());
  return a < b ? a : b;
}

/**
 * remove duplicate line
 */
function dedupe(lines) {
  const map = new Map();

  for (const l of lines) {
    const key = normalize(l.geometry.coordinates);
    map.set(key, l);
  }

  return Array.from(map.values());
}

// ================= MAIN =================

let allLines = [];

// 1. extract + convert
for (const feature of data.tinhData.features) {
  const poly = extractValidPolygon(feature);
  if (!poly) continue;

  const fixed = fixGeometry(poly);
  if (!fixed) continue;

  const lines = polygonToLines(fixed);
  allLines.push(...lines);
}

console.log('Raw lines:', allLines.length);

// 2. remove duplicate
allLines = dedupe(allLines);
console.log('After dedupe:', allLines.length);

// 3. 🔥 dissolve (gộp line liền nhau)
let dissolved;
try {
  dissolved = turf.lineDissolve(
    turf.featureCollection(allLines)
  );
} catch {
  dissolved = turf.featureCollection(allLines);
}

console.log('After dissolve:', dissolved.features.length);

// 4. 🔥 simplify (GIẢM POINT MẠNH NHẤT)
const simplified = turf.simplify(dissolved, {
  tolerance: 0, // 🔥 chỉnh số này
  highQuality: false,
});

console.log('Simplified');

// 5. combine → 1 MultiLineString
const combined = turf.combine(simplified);

// output
const output = {
  type: 'FeatureCollection',
  features: combined.features,
};

fs.writeFileSync(
  './all_lines.js',
  `export const allLines = ${JSON.stringify(output)};`
);

console.log('Done!');