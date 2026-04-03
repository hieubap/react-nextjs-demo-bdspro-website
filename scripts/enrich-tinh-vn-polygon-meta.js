/**
 * Đọc `tinhVN.js`, tính sẵn bbox + areaM2 (m²) cho từng phần polygon (outer ring)
 * và ghi vào `feature.properties.mapPolygonParts` — khớp logic `adminBoundaryPolygons.ts`.
 *
 * Chạy (cần RAM):
 *   node scripts/enrich-tinh-vn-polygon-meta.js
 *   NODE_OPTIONS=--max-old-space-size=8192 node scripts/enrich-tinh-vn-polygon-meta.js
 *
 * Nên backup file trước: `cp src/Screens/QHMapScreen/tinhVN.js tinhVN.js.bak`
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(
  __dirname,
  '../src/Screens/QHMapScreen/tinhVN.js',
);

/** Cân bằng ngoặc, bỏ qua chuỗi — giống build-tinh-vn-lines.js */
function sliceExportedObject(src, exportName) {
  const re = new RegExp(
    `export\\s+const\\s+${exportName}\\s*=\\s*`,
  );
  const m = src.match(re);
  if (!m) {
    throw new Error(`Không tìm thấy export const ${exportName}`);
  }
  let i = m.index + m[0].length;
  while (i < src.length && /\s/.test(src[i])) {
    i++;
  }
  if (src[i] !== '{') {
    throw new Error('Không phải object {');
  }
  let depth = 0;
  let stringQuote = null;
  let escape = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (stringQuote) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === '\\') {
        escape = true;
        continue;
      }
      if (c === stringQuote) {
        stringQuote = null;
      }
      continue;
    }
    if (c === '"' || c === "'") {
      stringQuote = c;
      continue;
    }
    if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        return src.slice(start, i + 1);
      }
    }
  }
  throw new Error('Không đóng được object');
}

function bboxFromOuterRingLngLat(ring) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (let r = 0; r < ring.length; r++) {
    const pt = ring[r];
    const lng = pt[0];
    const lat = pt[1];
    if (lat < minLat) {
      minLat = lat;
    }
    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lng < minLng) {
      minLng = lng;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
  }
  return {minLat, maxLat, minLng, maxLng};
}

/** Cùng công thức equirectangular / shoelace như RN `getPolygonAreaM2` */
function getPolygonAreaM2FromRingLngLat(ring) {
  if (!ring || ring.length < 3) {
    return 0;
  }
  const earthRadius = 6378137;
  let sumLat = 0;
  for (let i = 0; i < ring.length; i++) {
    sumLat += ring[i][1];
  }
  const lat0 = (sumLat / ring.length) * (Math.PI / 180);
  const points = ring.map(pt => {
    const lat = pt[1] * (Math.PI / 180);
    const lng = pt[0] * (Math.PI / 180);
    return {
      x: earthRadius * lng * Math.cos(lat0),
      y: earthRadius * lat,
    };
  });
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area) / 2;
}

function mapPolygonPartsFromGeometry(geometry) {
  if (!geometry || !geometry.coordinates) {
    return [];
  }
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates;
    if (!rings || !rings.length) {
      return [];
    }
    const outer = rings[0];
    if (!outer || outer.length < 3) {
      return [];
    }
    return [
      {
        bbox: bboxFromOuterRingLngLat(outer),
        areaM2: getPolygonAreaM2FromRingLngLat(outer),
      },
    ];
  }
  if (geometry.type === 'MultiPolygon') {
    const multi = geometry.coordinates;
    /** Cùng độ dài `multi`, `null` = slot không có polygon — khớp index `i` với key `adm_*_${i}` */
    return multi.map(polyRings => {
      if (!polyRings || !polyRings.length) {
        return null;
      }
      const outer = polyRings[0];
      if (!outer || outer.length < 3) {
        return null;
      }
      return {
        bbox: bboxFromOuterRingLngLat(outer),
        areaM2: getPolygonAreaM2FromRingLngLat(outer),
      };
    });
  }
  return [];
}

function main() {
  console.log('Đọc', INPUT);
  const raw = fs.readFileSync(INPUT, 'utf8');
  const objStr = sliceExportedObject(raw, 'tinhData');
  const data = new Function(`return (${objStr})`)();

  const features = data.features;
  if (!Array.isArray(features)) {
    throw new Error('Không có features[]');
  }

  let totalParts = 0;
  for (let fi = 0; fi < features.length; fi++) {
    const f = features[fi];
    if (!f || typeof f !== 'object') {
      continue;
    }
    f.properties = f.properties && typeof f.properties === 'object' ? f.properties : {};
    const parts = mapPolygonPartsFromGeometry(f.geometry);
    f.properties.mapPolygonParts = parts;
    for (let j = 0; j < parts.length; j++) {
      if (parts[j] != null) {
        totalParts++;
      }
    }
  }

  const body = JSON.stringify(data);
  const output = `export const tinhData = ${body};\n`;
  fs.writeFileSync(INPUT, output, 'utf8');

  const mb = (Buffer.byteLength(output, 'utf8') / 1e6).toFixed(2);
  console.log(
    `Đã ghi ${INPUT}: ${features.length} feature, ${totalParts} mapPolygonParts, ~${mb} MB`,
  );
}

main();
