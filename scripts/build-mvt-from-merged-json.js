/**
 * Build Mapbox Vector Tile (MVT) PBF from merged GeoJSON file.
 *
 * Input (default):
 *   data/json/merged/merged-5-25-26.json
 *
 * Output:
 *   {outDir}/{z}/{x}/{y}.pbf
 *
 * Usage:
 *   node scripts/build-mvt-from-merged-json.js --zMin 5 --zMax 8 --outDir data/pbf/merged
 */

const fs = require('fs');
const path = require('path');

const geojsonvt = require('geojson-vt').default;
const vtpbf = require('vt-pbf');

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

function updateBoundsFromRings(rings, bounds) {
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r];
    for (let p = 0; p < ring.length; p++) {
      const point = ring[p];
      const lng = point[0];
      const lat = point[1];
      if (lng < bounds.minLng) bounds.minLng = lng;
      if (lng > bounds.maxLng) bounds.maxLng = lng;
      if (lat < bounds.minLat) bounds.minLat = lat;
      if (lat > bounds.maxLat) bounds.maxLat = lat;
    }
  }
}

function computeFeatureCollectionBounds(featureCollection) {
  const bounds = {
    minLng: Infinity,
    minLat: Infinity,
    maxLng: -Infinity,
    maxLat: -Infinity,
  };

  const features = Array.isArray(featureCollection?.features)
    ? featureCollection.features
    : [];

  for (const feature of features) {
    const geometry = feature?.geometry;
    if (!geometry || !Array.isArray(geometry.coordinates)) continue;

    if (geometry.type === 'Polygon') {
      updateBoundsFromRings(geometry.coordinates, bounds);
    } else if (geometry.type === 'MultiPolygon') {
      for (const polygonRings of geometry.coordinates) {
        if (!Array.isArray(polygonRings)) continue;
        updateBoundsFromRings(polygonRings, bounds);
      }
    }
  }

  if (!Number.isFinite(bounds.minLng) || !Number.isFinite(bounds.minLat)) {
    return null;
  }
  return bounds;
}

function lngLatToTileXY(lng, lat, z) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
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

function parseBBoxArg() {
  const raw = getArg('bbox', '');
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

function readInputFeatureCollection(inputPath) {
  const raw = fs.readFileSync(inputPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (parsed?.type !== 'FeatureCollection' || !Array.isArray(parsed?.features)) {
    throw new Error(`Input is not FeatureCollection: ${inputPath}`);
  }
  return parsed;
}

async function main() {
  const inputPath = getArg(
    'input',
    'data/json/merged/merged-5-25-26.json',
  );
  const outDir = getArg('outDir', './files/public/map/province_boundary');
  const layerName = getArg('layer', 'vn_boundaries_city');
  const zMin = parseNum('zMin', 4);
  const zMax = parseNum('zMax', 16);
  const extent = parseNum('extent', 4096);
  const limitTiles = parseNum('limitTiles', 0);
  const bboxFromArg = parseBBoxArg();

  if (zMin < 0 || zMax < zMin) {
    throw new Error(`Invalid z range: zMin=${zMin}, zMax=${zMax}`);
  }

  const featureCollection = readInputFeatureCollection(inputPath);
  const autoBounds = computeFeatureCollectionBounds(featureCollection);
  const bounds = bboxFromArg || autoBounds;

  if (!bounds) {
    throw new Error('Cannot determine bounds. Please provide --bbox.');
  }

  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outDir}`);
  console.log(`Layer: ${layerName}`);
  console.log(`z range: ${zMin} -> ${zMax}`);
  console.log(
    `Bounds: ${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`,
  );

  const tileIndex = geojsonvt(featureCollection, {
    maxZoom: zMax,
    indexMaxZoom: Math.min(6, zMax),
    tolerance: 0,
    indexMaxPoints: 2000,
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
    console.log(`[z=${z}] x=${minX}..${maxX}, y=${minY}..${maxY}`);

    for (let x = minX; x <= maxX; x++) {
      const xDir = path.join(outDir, String(z), String(x));
      fs.mkdirSync(xDir, {recursive: true});

      for (let y = minY; y <= maxY; y++) {
        if (limitTiles > 0 && writtenTiles >= limitTiles) {
          console.log(`Stop due to --limitTiles=${limitTiles}`);
          console.log(`Total written tiles: ${writtenTiles}`);
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
  }

  console.log(`Done. Total written tiles: ${writtenTiles}`);
}

main().catch(e => {
  console.error(e?.stack || String(e));
  process.exit(1);
});
