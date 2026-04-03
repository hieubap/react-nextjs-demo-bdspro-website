/**
 * Đọc `tinhVN.js` → build 2 mảng overlay: `adminOverlayPolygonsAlways` / `adminOverlayPolygonsNormal`
 * (lọc, areaM2, sort, tách theo ALWAYS_VISIBLE_AREA_M2 khớp BDSMap) → ghi `adminOverlayPolygons.generated.js`.
 *
 * Chạy sau khi cập nhật `tinhVN.js` (khuyến nghị sau `yarn enrich-tinh-vn`):
 *   yarn build-admin-overlay
 *   NODE_OPTIONS=--max-old-space-size=8192 yarn build-admin-overlay
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(
  __dirname,
  './tinhVN.js',
);
const OUTPUT = path.join(
  __dirname,
  './adminOverlayPolygons.generated.js',
);

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

function bboxFromRing(coordinates) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (let k = 0; k < coordinates.length; k++) {
    const c = coordinates[k];
    if (c.latitude < minLat) {
      minLat = c.latitude;
    }
    if (c.latitude > maxLat) {
      maxLat = c.latitude;
    }
    if (c.longitude < minLng) {
      minLng = c.longitude;
    }
    if (c.longitude > maxLng) {
      maxLng = c.longitude;
    }
  }
  return {minLat, maxLat, minLng, maxLng};
}

function ringToLatLng(ring) {
  return ring.map(([lng, lat]) => ({latitude: lat, longitude: lng}));
}

function isValidPartMeta(pre) {
  return (
    pre != null &&
    pre.bbox != null &&
    typeof pre.areaM2 === 'number' &&
    Number.isFinite(pre.areaM2)
  );
}

function polygonsFromGeometry(geometry, baseId, precomputed) {
  if (!geometry || !geometry.coordinates) {
    return [];
  }
  if (geometry.type === 'Polygon') {
    const rings = geometry.coordinates;
    if (!rings || !rings.length) {
      return [];
    }
    const coordinates = ringToLatLng(rings[0]);
    const pre = precomputed && precomputed[0];
    const usePre = isValidPartMeta(pre);
    const bbox = usePre ? pre.bbox : bboxFromRing(coordinates);
    const areaM2 = usePre ? pre.areaM2 : undefined;
    const o = {
      key: `${baseId}_0`,
      coordinates,
      bbox,
    };
    if (rings.length > 1) {
      o.holes = rings.slice(1).map(ringToLatLng);
    }
    if (areaM2 != null) {
      o.areaM2 = areaM2;
    }
    return [o];
  }
  if (geometry.type === 'MultiPolygon') {
    const multi = geometry.coordinates;
    return multi
      .map((polyRings, i) => {
        if (!polyRings || !polyRings.length) {
          return null;
        }
        const coordinates = ringToLatLng(polyRings[0]);
        const pre = precomputed && precomputed[i];
        const usePre = isValidPartMeta(pre);
        const bbox = usePre ? pre.bbox : bboxFromRing(coordinates);
        const areaM2 = usePre ? pre.areaM2 : undefined;
        const o = {
          key: `${baseId}_${i}`,
          coordinates,
          bbox,
        };
        if (polyRings.length > 1) {
          o.holes = polyRings.slice(1).map(ringToLatLng);
        }
        if (areaM2 != null) {
          o.areaM2 = areaM2;
        }
        return o;
      })
      .filter(Boolean);
  }
  return [];
}

function getPolygonAreaM2(coords) {
  if (!coords || coords.length < 3) {
    return 0;
  }
  const earthRadius = 6378137;
  let sumLat = 0;
  for (let i = 0; i < coords.length; i++) {
    sumLat += coords[i].latitude;
  }
  const lat0 = (sumLat / coords.length) * (Math.PI / 180);
  const points = coords.map(p => {
    const lat = p.latitude * (Math.PI / 180);
    const lng = p.longitude * (Math.PI / 180);
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

function getAdminBoundaryPolygonsFromData(data) {
  const features = data.features;
  if (!Array.isArray(features)) {
    return [];
  }
  const out = [];
  for (let fi = 0; fi < features.length; fi++) {
    const f = features[fi];
    const baseId = `${fi}`;
    const precomputed = f.properties && f.properties.mapPolygonParts;
    const parts = polygonsFromGeometry(
      f.geometry,
      String(baseId),
      Array.isArray(precomputed) ? precomputed : undefined,
    );
    for (let p = 0; p < parts.length; p++) {
      out.push(parts[p]);
    }
  }
  return out;
}

function main() {
  console.log('Đọc', INPUT);
  const raw = fs.readFileSync(INPUT, 'utf8');
  const objStr = sliceExportedObject(raw, 'tinhData');
  const data = new Function(`return (${objStr})`)();

  const polygons = getAdminBoundaryPolygonsFromData(data);
  const processed = polygons
    .filter(
      p =>
        Array.isArray(p.coordinates) && p.coordinates.length >= 3,
    )
    .map(p => {
      const areaM2 =
        typeof p.areaM2 === 'number' && Number.isFinite(p.areaM2)
          ? p.areaM2
          : getPolygonAreaM2(p.coordinates);
      const {areaM2: _drop, ...rest} = p;
      return {...rest, areaM2};
    })
    .filter(p => p.areaM2 > 0)
    .sort((a, b) => b.areaM2 - a.areaM2);

  /** Khớp `ALWAYS_VISIBLE_AREA_M2` trong `src/Components/BDSMap/index.tsx` */
  const ALWAYS_VISIBLE_AREA_M2 = 500_000_000;
  const always = [];
  const normal = [];
  for (let i = 0; i < processed.length; i++) {
    const p = processed[i];
    if (p.areaM2 > ALWAYS_VISIBLE_AREA_M2) {
      always.push(p);
    } else {
      normal.push(p);
    }
  }

  const jsonAlways = JSON.stringify(always);
  const jsonNormal = JSON.stringify(normal);
  const out = `/**
 * AUTO-GENERATED — scripts/build-admin-overlay-polygons.js
 * Không sửa tay. Cập nhật: yarn build-admin-overlay
 * Tách always / normal theo ALWAYS_VISIBLE_AREA_M2 (khớp BDSMap).
 */
export const adminOverlayPolygonsAlways = ${jsonAlways};
export const adminOverlayPolygonsNormal = ${jsonNormal};
`;

  fs.writeFileSync(OUTPUT, out, 'utf8');
  const mb = (Buffer.byteLength(out, 'utf8') / 1e6).toFixed(2);
  console.log(
    `Đã ghi ${OUTPUT}: always=${always.length}, normal=${normal.length}, tổng=${processed.length}, ~${mb} MB`,
  );
}

main();
