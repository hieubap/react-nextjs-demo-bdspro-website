/**
 * Build MVT tối ưu:
 *
 * - z 4–6: drop polygon nhỏ + simplify mạnh
 * - z 7–8: drop vừa + simplify vừa
 * - z 9–12: giữ detail + simplify nhẹ
 */

const fs = require('fs-extra');
const path = require('path');
const geojsonvt = require('geojson-vt').default;
const vtpbf = require('vt-pbf');
const simplify = require('@turf/simplify').default;

const INPUT_DIR = path.join(__dirname, '../.data/province');
const OUTPUT_DIR = path.join(__dirname, '../.data/pbf/province_boundary');

const MIN_ZOOM = 4;
const MAX_ZOOM = 12;
const LAYER_NAME = 'province_boundary';

/**
 * Load GeoJSON
 */
async function loadGeoJSON() {
  const files = await fs.readdir(INPUT_DIR);
  let features = [];

  for (const file of files) {
    if (!file.endsWith('.json') && !file.endsWith('.geojson')) continue;

    const data = await fs.readJson(path.join(INPUT_DIR, file));

    if (data.type === 'FeatureCollection') {
      features.push(...data.features);
    } else if (data.type === 'Feature') {
      features.push(data);
    }
  }

  console.log(`📊 Total features: ${features.length}`);

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Compute bounds
 */
function computeBounds(fc) {
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

  fc.features.forEach(f => {
    if (f.geometry) walk(f.geometry.coordinates);
  });

  return {minLng, minLat, maxLng, maxLat};
}

/**
 * Shoelace formula
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
 * Filter polygon trong geometry
 */
function filterGeometry(geometry, minArea) {
  if (!geometry) return geometry;

  if (geometry.type === 'Polygon') {
    const area = polygonArea(geometry.coordinates[0]);
    return area >= minArea ? geometry : null;
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
    const newGeom = filterGeometry(f.geometry, minArea);
    if (!newGeom) continue;

    result.push({
      ...f,
      geometry: newGeom,
    });
  }

  return result;
}

/**
 * 🔥 Simplify bằng turf (GIẢM POINT THẬT)
 */
function simplifyGeoJSON(geojson, z) {
  let tolerance;

  if (z <= 6) tolerance = 0.005;
  else if (z <= 8) tolerance = 0.001;
  else if (z <= 12) tolerance = 0.0001;
  else tolerance = 0;

  if (tolerance === 0) return geojson;

  return simplify(geojson, {
    tolerance,
    highQuality: false,
    mutate: false,
  });
}

/**
 * tolerance geojson-vt
 */
function getTolerance(z) {
  if (z <= 6) return 20;
  if (z <= 8) return 10;
  if (z <= 12) return 3;
  return 0;
}

/**
 * lng/lat -> tile
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
 * tile range
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
  console.log('🔄 Loading...');
  const geojson = await loadGeoJSON();

  const bounds = computeBounds(geojson);
  console.log('🌏 Bounds:', bounds);

  let totalTiles = 0;

  for (let z = MIN_ZOOM; z <= MAX_ZOOM; z++) {
    console.log(`\n📦 Zoom ${z}`);

    // 1. filter polygon nhỏ
    const filteredFeatures = filterFeatures(geojson.features, z);

    const filteredGeojson = {
      type: 'FeatureCollection',
      features: filteredFeatures,
    };

    // 2. simplify thật sự (🔥 mới là cái giảm point mạnh)
    const simplifiedGeojson = simplifyGeoJSON(filteredGeojson, z);

    console.log(
      `   → features: ${filteredFeatures.length} (after filter + simplify)`,
    );

    // const tolerance = getTolerance(z);

    const tileIndex = geojsonvt(simplifiedGeojson, {
      maxZoom: z,
      indexMaxZoom: Math.min(4, z),
      indexMaxPoints: 2000,
      tolerance: 0,
      extent: 4096,
      buffer: 64,
    });

    const {minX, maxX, minY, maxY} = tileRange(bounds, z);

    for (let x = minX; x <= maxX; x++) {
      const dir = path.join(OUTPUT_DIR, `${z}/${x}`);
      await fs.ensureDir(dir);

      for (let y = minY; y <= maxY; y++) {
        const tile = tileIndex.getTile(z, x, y);

        if (!tile || !tile.features || tile.features.length === 0) continue;

        const buff = vtpbf.fromGeojsonVt({
          [LAYER_NAME]: tile,
        });

        await fs.writeFile(path.join(dir, `${y}.pbf`), buff);

        totalTiles++;
      }
    }
  }

  console.log(`\n🎉 DONE! Total tiles: ${totalTiles}`);
}

main().catch(console.error);
