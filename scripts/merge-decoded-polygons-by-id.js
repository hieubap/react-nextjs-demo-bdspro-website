/**
 * Merge decoded tile polygons into one JSON file by properties.id.
 *
 * Default input dirs:
 *   data/json/5/25
 *   data/json/5/26
 *
 * Usage:
 *   node scripts/merge-decoded-polygons-by-id.js
 *   node scripts/merge-decoded-polygons-by-id.js --inputDirs "data/json/5/25,data/json/5/26" --outFile "data/json/merged/merged-5-25-26.json"
 */

const fs = require('fs');
const path = require('path');

const turf = require('@turf/turf');

function getArg(name, defaultValue) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return defaultValue;
  const v = process.argv[idx + 1];
  if (v == null) return defaultValue;
  return v;
}

function toPolygonParts(geometry) {
  if (!geometry || !geometry.type || !Array.isArray(geometry.coordinates)) {
    return [];
  }
  if (geometry.type === 'Polygon') return [geometry.coordinates];
  if (geometry.type === 'MultiPolygon') return geometry.coordinates;
  return [];
}

function listJsonFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, {withFileTypes: true});
  return entries
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.json'))
    .map(entry => path.join(dirPath, entry.name));
}

function unionPolygonParts(ringsArray) {
  if (!ringsArray.length) return null;
  if (ringsArray.length === 1) {
    return {
      type: 'Polygon',
      coordinates: ringsArray[0],
    };
  }
  try {
    const features = ringsArray.map(rings => turf.polygon(rings));
    const merged = turf.union(turf.featureCollection(features));
    return merged ? merged.geometry : null;
  } catch (e) {
    console.warn('turf.union failed, falling back to MultiPolygon:', e?.message || e);
    return null;
  }
}

function mergeGeometries(geometries) {
  const allRingsArrays = [];
  for (const geometry of geometries) {
    const parts = toPolygonParts(geometry);
    for (const rings of parts) {
      allRingsArrays.push(rings);
    }
  }
  if (!allRingsArrays.length) return null;

  if (allRingsArrays.length === 1) {
    const rings = allRingsArrays[0];
    return {
      type: 'Polygon',
      coordinates: rings,
    };
  }

  const merged = unionPolygonParts(allRingsArrays);
  if (merged) return merged;

  return {
    type: 'MultiPolygon',
    coordinates: allRingsArrays,
  };
}

function getAllFeaturesFromDecodedTile(decodedTileJson) {
  const layersObj = decodedTileJson?.layers;
  if (!layersObj || typeof layersObj !== 'object') return [];

  const out = [];
  for (const layerName of Object.keys(layersObj)) {
    const features = layersObj?.[layerName]?.featureCollection?.features;
    if (!Array.isArray(features)) continue;
    for (const feature of features) {
      out.push(feature);
    }
  }
  return out;
}

function main() {
  const inputDirsRaw = getArg('inputDirs', 'data/json/5/25,data/json/5/26');
  const outFile = getArg('outFile', 'data/json/merged/merged-5-25-26.json');
  const inputDirs = inputDirsRaw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!inputDirs.length) {
    throw new Error('No input dirs. Use --inputDirs "dirA,dirB"');
  }

  const allInputFiles = [];
  for (const dirPath of inputDirs) {
    allInputFiles.push(...listJsonFiles(dirPath));
  }

  if (!allInputFiles.length) {
    throw new Error(`No .json files found in: ${inputDirs.join(', ')}`);
  }

  // key: properties.id -> { properties, geometries: GeoJSON[] }
  const byId = new Map();
  let totalReadFeatures = 0;
  let skippedNoId = 0;
  let skippedNoGeometry = 0;

  for (const filePath of allInputFiles) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const decodedTile = JSON.parse(raw);
    const features = getAllFeaturesFromDecodedTile(decodedTile);

    for (const feature of features) {
      totalReadFeatures++;
      const id = feature?.properties?.id;
      if (!id) {
        skippedNoId++;
        continue;
      }

      const parts = toPolygonParts(feature?.geometry);
      if (!parts.length) {
        skippedNoGeometry++;
        continue;
      }

      if (!byId.has(id)) {
        byId.set(id, {
          properties: {...feature.properties},
          geometries: [feature.geometry],
        });
      } else {
        const entry = byId.get(id);
        entry.geometries.push(feature.geometry);
      }
    }
  }

  const mergedFeatures = [];
  for (const [, entry] of byId) {
    const geometry = mergeGeometries(entry.geometries);
    if (!geometry) continue;
    mergedFeatures.push({
      type: 'Feature',
      properties: entry.properties,
      geometry,
    });
  }
  const outObj = {
    type: 'FeatureCollection',
    metadata: {
      mergedBy: 'properties.id',
      unionPolygonParts: true,
      inputDirs,
      inputFileCount: allInputFiles.length,
      totalReadFeatures,
      outputFeatureCount: mergedFeatures.length,
      skippedNoId,
      skippedNoGeometry,
    },
    features: mergedFeatures,
  };

  fs.mkdirSync(path.dirname(outFile), {recursive: true});
  fs.writeFileSync(outFile, JSON.stringify(outObj, null, 2), 'utf8');

  console.log(`Input dirs: ${inputDirs.join(', ')}`);
  console.log(`Input files: ${allInputFiles.length}`);
  console.log(`Read features: ${totalReadFeatures}`);
  console.log(`Merged features (unique id): ${mergedFeatures.length}`);
  console.log(`Skipped no id: ${skippedNoId}`);
  console.log(`Skipped no geometry: ${skippedNoGeometry}`);
  console.log(`Output: ${outFile}`);
}

main();
