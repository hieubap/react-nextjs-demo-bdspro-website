/**
 * Build Mapbox Vector Tile (MVT) PBF for tinhVN boundaries by z/x/y.
 *
 * Input:
 *   src/Screens/QHMapScreen/tinhVN.js (export const tinhData = FeatureCollection)
 *
 * Output:
 *   {outDir}/{z}/{x}/{y}.pbf
 *
 * Run:
 *   yarn add -D vt-pbf
 *   node --max-old-space-size=8192 scripts/build-tinh-vn-mvt-pbf.js --zMin 10 --zMax 14 --outDir ./tiles_pbf
 *
 * Note:
 *   This uses `geojson-vt` -> tile objects (internal tile geometry),
 *   then `vt-pbf.fromGeojsonVt` to serialize into the standard MVT protobuf.
 */

const fs = require('fs');
const path = require('path');

const geojsonvt = require('geojson-vt').default;

let vtpbf = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  vtpbf = require('vt-pbf');
} catch (e) {
  console.error(
    'Thiếu dependency `vt-pbf`. Cài bằng: `yarn add -D vt-pbf` rồi chạy lại.',
  );
  console.error(e?.message || String(e));
  process.exit(1);
}

const INPUT = path.join(__dirname, '../src/Screens/QHMapScreen/tinhVN.js');

function getArg(name, defaultValue) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return defaultValue;
  const v = process.argv[idx + 1];
  if (v == null) return defaultValue;
  return v;
}

function parseNum(name, defaultValue) {
  const v = getArg(name, String(defaultValue));
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid --${name}=${v}`);
  }
  return n;
}

function parseBBoxArg() {
  const raw = getArg(
    'bbox',
    '', // format: minLng,minLat,maxLng,maxLat
  );
  if (!raw) return null;
  const parts = raw.split(',').map(s => Number(s.trim()));
  if (parts.length !== 4 || parts.some(n => !Number.isFinite(n))) {
    throw new Error(
      'Invalid --bbox. Expected: --bbox minLng,minLat,maxLng,maxLat',
    );
  }
  const [minLng, minLat, maxLng, maxLat] = parts;
  return {minLng, minLat, maxLng, maxLat};
}

function sliceExportedObject(src, exportName) {
  const re = new RegExp(`export\\s+const\\s+${exportName}\\s*=\\s*`);
  const m = src.match(re);
  if (!m) {
    throw new Error(`Không tìm thấy export const ${exportName}`);
  }
  let i = m.index + m[0].length;
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== '{') throw new Error('Không phải object {');

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
      if (c === stringQuote) stringQuote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      stringQuote = c;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error('Không đóng được object');
}

function isValidPartMeta(pre) {
  return (
    pre != null &&
    pre.bbox != null &&
    typeof pre.areaM2 === 'number' &&
    Number.isFinite(pre.areaM2)
  );
}

function lngLatToTileXY(lng, lat, z) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  // XYZ scheme (y=0 ở phía Bắc/top)
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
      n,
  );
  return {x, y};
}

function tileRangeForBounds(minLng, minLat, maxLng, maxLat, z) {
  const corners = [
    lngLatToTileXY(minLng, minLat, z),
    lngLatToTileXY(minLng, maxLat, z),
    lngLatToTileXY(maxLng, minLat, z),
    lngLatToTileXY(maxLng, maxLat, z),
  ];

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const c of corners) {
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.y < minY) minY = c.y;
    if (c.y > maxY) maxY = c.y;
  }

  const n = 2 ** z;
  return {
    minX: Math.max(0, minX),
    maxX: Math.min(n - 1, maxX),
    minY: Math.max(0, minY),
    maxY: Math.min(n - 1, maxY),
  };
}

function updateBoundsFromPolygonRings(rings, bounds) {
  // rings: [outerRing, hole1, hole2...], each ring: [[lng,lat], ...]
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    for (let p = 0; p < ring.length; p++) {
      const pt = ring[p];
      const lng = pt[0];
      const lat = pt[1];
      if (lng < bounds.minLng) bounds.minLng = lng;
      if (lng > bounds.maxLng) bounds.maxLng = lng;
      if (lat < bounds.minLat) bounds.minLat = lat;
      if (lat > bounds.maxLat) bounds.maxLat = lat;
    }
  }
}

function parseTinhData() {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const objStr = sliceExportedObject(raw, 'tinhData');
  return new Function(`return (${objStr})`)();
}

function buildGeojsonFeatureCollection(tinhData) {
  const features = [];

  const bounds = {
    minLng: Infinity,
    minLat: Infinity,
    maxLng: -Infinity,
    maxLat: -Infinity,
  };

  const srcFeatures = Array.isArray(tinhData?.features)
    ? tinhData.features
    : [];

  for (let fi = 0; fi < srcFeatures.length; fi++) {
    const f = srcFeatures[fi];
    const baseId = `${fi}`;

    const geom = f?.geometry;
    const precomputed = f?.properties?.mapPolygonParts;
    const preArr = Array.isArray(precomputed) ? precomputed : null;

    if (!geom?.type || !geom?.coordinates) continue;

    if (geom.type === 'Polygon') {
      const rings = geom.coordinates;
      if (!Array.isArray(rings) || !rings.length) continue;

      const partIndex = 0;
      const pre = preArr ? preArr[partIndex] : null;
      const areaM2 = isValidPartMeta(pre) ? pre.areaM2 : null;

      updateBoundsFromPolygonRings(rings, bounds);

      features.push({
        type: 'Feature',
        properties: {
          key: `${baseId}_0`,
          ...(areaM2 != null ? {areaM2} : {}),
        },
        geometry: {
          type: 'Polygon',
          coordinates: rings,
        },
      });
    } else if (geom.type === 'MultiPolygon') {
      const multi = geom.coordinates;
      if (!Array.isArray(multi) || !multi.length) continue;

      for (let pi = 0; pi < multi.length; pi++) {
        const polyRings = multi[pi];
        if (!Array.isArray(polyRings) || !polyRings.length) continue;

        const pre = preArr ? preArr[pi] : null;
        const areaM2 = isValidPartMeta(pre) ? pre.areaM2 : null;

        updateBoundsFromPolygonRings(polyRings, bounds);

        features.push({
          type: 'Feature',
          properties: {
            key: `${baseId}_${pi}`,
            ...(areaM2 != null ? {areaM2} : {}),
          },
          geometry: {
            type: 'Polygon',
            coordinates: polyRings,
          },
        });
      }
    }
  }

  // If the caller didn't provide bbox and we failed to compute bounds,
  // return null and let the caller decide.
  const computedBounds =
    Number.isFinite(bounds.minLng) && Number.isFinite(bounds.minLat)
      ? bounds
      : null;

  return {
    featureCollection: {
      type: 'FeatureCollection',
      features,
    },
    computedBounds,
  };
}

async function main() {
  const zMin = parseNum('zMin', 1);
  const zMax = parseNum('zMax', 16);
  if (zMin < 0 || zMax < zMin) {
    throw new Error(`Invalid z range: zMin=${zMin}, zMax=${zMax}`);
  }

  const outDir = getArg('outDir', './map/province_boundary');
  const layerName = getArg('layer', 'admin');
  const extent = parseNum('extent', 4096);
  const bbox = parseBBoxArg();
  const limitTiles = parseNum('limitTiles', 0); // 0 => no limit

  console.log('Input:', INPUT);
  console.log('Output:', outDir);
  console.log('Layer:', layerName);
  console.log('z range:', zMin, '→', zMax);
  console.log('extent:', extent);
  console.log('bbox:', bbox ? JSON.stringify(bbox) : '(auto)');

  const tinhData = parseTinhData();
  const {featureCollection, computedBounds} =
    buildGeojsonFeatureCollection(tinhData);

  if (!featureCollection.features.length) {
    console.log('No features extracted from tinhVN.js.');
    return;
  }

  const bounds = bbox ?? computedBounds;
  if (!bounds) {
    throw new Error(
      'Không thể tính bbox tự động. Hãy truyền --bbox minLng,minLat,maxLng,maxLat.',
    );
  }

  console.log(
    'Using bounds:',
    `minLng=${bounds.minLng}, minLat=${bounds.minLat}, maxLng=${bounds.maxLng}, maxLat=${bounds.maxLat}`,
  );

  // Build geojson-vt index once for all requested zooms.
  const tileIndex = geojsonvt(featureCollection, {
    maxZoom: zMax,
    indexMaxZoom: Math.min(6, zMax),
    tolerance: 0,
    indexMaxPoints: 2_000,
  });

  let writtenTiles = 0;

  for (let z = zMin; z <= zMax; z++) {
    const {minX, maxX, minY, maxY} = tileRangeForBounds(
      bounds.minLng,
      bounds.minLat,
      bounds.maxLng,
      bounds.maxLat,
      z,
    );

    console.log(`\n[z=${z}] tiles range: x=${minX}..${maxX}, y=${minY}..${maxY}`);

    for (let x = minX; x <= maxX; x++) {
      const xDir = path.join(outDir, String(z), String(x));
      fs.mkdirSync(xDir, {recursive: true});

      for (let y = minY; y <= maxY; y++) {
        if (limitTiles > 0 && writtenTiles >= limitTiles) {
          console.log(`Stop due to --limitTiles=${limitTiles}`);
          return;
        }

        const tile = tileIndex.getTile(z, x, y);
        if (!tile || !tile.features || tile.features.length === 0) continue;

        const buff = vtpbf.fromGeojsonVt(
          {[layerName]: tile},
          {version: 1, extent},
        );
        const outPath = path.join(xDir, `${y}.pbf`);
        fs.writeFileSync(outPath, buff);
        writtenTiles++;
      }
    }

    console.log(`[z=${z}] writtenTiles so far:`, writtenTiles);
  }

  console.log('\nDone. Total written tiles:', writtenTiles);
}

main().catch(e => {
  console.error(e?.stack || String(e));
  process.exit(1);
});

