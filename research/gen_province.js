/**
 * Build MVT tối ưu:
 *
 * - province + ward
 * - tách 2 layer
 * - ward chỉ xuất hiện từ z >= 8
 * - simplify + filter theo zoom
 */

const fs = require('fs-extra');
const path = require('path');
const geojsonvt = require('geojson-vt').default;
const vtpbf = require('vt-pbf');
const simplify = require('@turf/simplify').default;

const PROVINCE_DIR = path.join(__dirname, '../.data/province');
const WARD_DIR = path.join(__dirname, '../.data/ward');
const OUTPUT_DIR = path.join(__dirname, '../.data/pbf/admin');

const MIN_ZOOM = 12;
const MAX_ZOOM = 16;

const LAYER_PROVINCE = 'province_boundary';
const LAYER_WARD = 'ward_boundary';

/**
 * Load GeoJSON từ folder
 */
async function loadGeoJSONFromDir(dir) {
  const files = await fs.readdir(dir);
  let features = [];

  for (const file of files) {
    if (!file.endsWith('.json') && !file.endsWith('.geojson')) continue;

    const data = await fs.readJson(path.join(dir, file));

    if (data.type === 'FeatureCollection') {
      features.push(...data.features);
    } else if (data.type === 'Feature') {
      features.push(data);
    }
  }

  console.log(`📂 ${dir} → ${features.length} features`);
  return features;
}

/**
 * Compute bounds
 */
function computeBounds(features) {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;

  function walk(coords) {
    if (typeof coords[0] === 'number') {
      const [lng, lat] = coords;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    } else {
      coords.forEach(walk);
    }
  }

  features.forEach(f => {
    if (f.geometry) walk(f.geometry.coordinates);
  });

  return {minLng, minLat, maxLng, maxLat};
}

/**
 * Shoelace area
 */
function polygonArea(coords) {
  let area = 0;

  for (let i = 0; i < coords.length; i++) {
    const [x1, y1] = coords[i];
    const [x2, y2] = coords[(i + 1) % coords.length];
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
}

/**
 * Filter polygon nhỏ
 */
function filterGeometry(geometry, minArea) {
  if (!geometry) return null;

  if (geometry.type === 'Polygon') {
    return polygonArea(geometry.coordinates[0]) >= minArea
      ? geometry
      : null;
  }

  if (geometry.type === 'MultiPolygon') {
    const filtered = geometry.coordinates.filter(poly => {
      return polygonArea(poly[0]) >= minArea;
    });

    if (filtered.length === 0) return null;

    return {
      type: 'MultiPolygon',
      coordinates: filtered,
    };
  }

  return geometry;
}

/**
 * Filter theo zoom
 */
function filterFeatures(features, z) {
  let minArea;

  if (z <= 6) minArea = 0.001;
  else if (z <= 8) minArea = 0.00002;
  else if (z <= 10) minArea = 0.000001;
  else minArea = 0;

  if (minArea === 0) return features;

  const result = [];

  for (const f of features) {
    const geom = filterGeometry(f.geometry, minArea);
    if (!geom) continue;

    result.push({
      ...f,
      geometry: geom,
    });
  }

  return result;
}

/**
 * Simplify
 */
function simplifyGeoJSON(fc, z) {
  let tolerance;

  if (z <= 6) tolerance = 0.005;
  else if (z <= 8) tolerance = 0.001;
  else if (z <= 12) tolerance = 0.0001;
  else tolerance = 0;

  if (tolerance === 0) return fc;

  return simplify(fc, {
    tolerance,
    highQuality: false,
    mutate: false,
  });
}

/**
 * lng/lat → tile
 */
function lngLatToTile(lng, lat, z) {
  const n = 2 ** z;
  const x = Math.floor(((lng + 180) / 360) * n);

  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  );

  return {x, y};
}

/**
 * Tile range
 */
function tileRange(bounds, z) {
  const corners = [
    lngLatToTile(bounds.minLng, bounds.minLat, z),
    lngLatToTile(bounds.minLng, bounds.maxLat, z),
    lngLatToTile(bounds.maxLng, bounds.minLat, z),
    lngLatToTile(bounds.maxLng, bounds.maxLat, z),
  ];

  return {
    minX: Math.min(...corners.map(c => c.x)),
    maxX: Math.max(...corners.map(c => c.x)),
    minY: Math.min(...corners.map(c => c.y)),
    maxY: Math.max(...corners.map(c => c.y)),
  };
}

/**
 * MAIN
 */
async function main() {
  console.log('🔄 Loading data...');

  const provinceFeatures = await loadGeoJSONFromDir(PROVINCE_DIR);
  const wardFeatures = await loadGeoJSONFromDir(WARD_DIR);

  const bounds = computeBounds([
    ...provinceFeatures,
    ...wardFeatures,
  ]);

  console.log('🌏 Bounds:', bounds);

  let totalTiles = 0;

  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    console.log(`\n📦 Zoom ${z}`);

    // Province
    const provinceFiltered = filterFeatures(provinceFeatures, z);
    const provinceSimplified = simplifyGeoJSON(
      {type: 'FeatureCollection', features: provinceFiltered},
      z,
    );

    const provinceIndex = geojsonvt(provinceSimplified, {
      maxZoom: z,
      indexMaxZoom: Math.min(4, z),
      indexMaxPoints: 2000,
      tolerance: 0,
      extent: 4096,
      buffer: 64,
    });

    // Ward (chỉ từ z >= 8)
    let wardIndex = null;

    if (z >= 8) {
      const wardFiltered = filterFeatures(wardFeatures, z);
      const wardSimplified = simplifyGeoJSON(
        {type: 'FeatureCollection', features: wardFiltered},
        z,
      );

      wardIndex = geojsonvt(wardSimplified, {
        maxZoom: z,
        indexMaxZoom: Math.min(4, z),
        indexMaxPoints: 2000,
        tolerance: 0,
        extent: 4096,
        buffer: 64,
      });

      console.log(`   → ward features: ${wardFiltered.length}`);
    }

    const {minX, maxX, minY, maxY} = tileRange(bounds, z);

    for (let x = minX; x <= maxX; x++) {
      const dir = path.join(OUTPUT_DIR, `${z}/${x}`);
      await fs.ensureDir(dir);

      for (let y = minY; y <= maxY; y++) {
        const layers = {};

        const provinceTile = provinceIndex.getTile(z, x, y);
        if (provinceTile && provinceTile.features.length > 0) {
          layers[LAYER_PROVINCE] = provinceTile;
        }

        if (wardIndex) {
          const wardTile = wardIndex.getTile(z, x, y);
          if (wardTile && wardTile.features.length > 0) {
            layers[LAYER_WARD] = wardTile;
          }
        }

        if (Object.keys(layers).length === 0) continue;

        const buff = vtpbf.fromGeojsonVt(layers);

        await fs.writeFile(path.join(dir, `${y}.pbf`), buff);
        totalTiles++;
      }
    }
  }

  console.log(`\n🎉 DONE! Total tiles: ${totalTiles}`);
}

main().catch(console.error);