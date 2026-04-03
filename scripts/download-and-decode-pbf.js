/**
 * Download vector tile .pbf, save và decode sang JSON.
 *
 * Mặc định: URL đã có z cố định trong path; chỉ thay {x} và {y}.
 * Khoảng x,y cấu hình ngay trong file (TILE_XY_RANGE), không truyền từ CLI.
 *
 * Chạy:
 *   node scripts/download-and-decode-pbf.js
 *
 * Một tile đơn (ghi đè chế độ range):
 *   node scripts/download-and-decode-pbf.js --url "https://.../z/x/y.pbf"
 *
 * Optional:
 *   --outPbfDir data/bouding
 *   --outJsonDir data/json
 *   --skipErrors
 */

const fs = require('fs');
const path = require('path');

let VectorTile;
let Protobuf;

try {
  ({VectorTile} = require('@mapbox/vector-tile'));
  Protobuf = require('pbf').default;
} catch (e) {
  console.error(
    'Missing dependencies. Run: yarn add -D @mapbox/vector-tile pbf',
  );
  console.error(e?.message || String(e));
  process.exit(1);
}

/** URL mẫu: z nằm trong path; thay {x}, {y} khi tải */
const TILE_URL_TEMPLATE =
  'https://mapv3.meeymap.com/data/vietnam-latest-v28/7/{x}/{y}.pbf';

/** Khoảng tile (XYZ) — sửa trực tiếp ở đây */
const TILE_XY_RANGE = {
  xMin: 52,
  xMax: 98,
  yMin: 53,
  yMax: 102,
};

function getArg(name, defaultValue) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return defaultValue;
  const v = process.argv[idx + 1];
  if (v == null) return defaultValue;
  return v;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function parseTileFromUrl(urlString) {
  const url = new URL(urlString);
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 3) {
    throw new Error(`Invalid tile URL path: ${url.pathname}`);
  }
  const yPart = parts[parts.length - 1];
  const xPart = parts[parts.length - 2];
  const zPart = parts[parts.length - 3];
  const y = Number(yPart.replace(/\.pbf$/i, ''));
  const x = Number(xPart);
  const z = Number(zPart);
  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error(`Cannot parse z/x/y from URL: ${urlString}`);
  }
  return {z, x, y};
}

function buildUrlFromTemplate(template, x, y) {
  return template.replaceAll('{x}', String(x)).replaceAll('{y}', String(y));
}

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }
  const arr = await res.arrayBuffer();
  return Buffer.from(arr);
}

function decodeVectorTile(buffer, z, x, y) {
  const tile = new VectorTile(new Protobuf(buffer));
  const layerNames = Object.keys(tile.layers);
  const layers = {};

  for (const layerName of layerNames) {
    const layer = tile.layers[layerName];
    const features = [];
    for (let i = 0; i < layer.length; i++) {
      const f = layer.feature(i);
      features.push(f.toGeoJSON(x, y, z));
    }
    layers[layerName] = {
      name: layerName,
      version: layer.version,
      extent: layer.extent,
      length: layer.length,
      featureCollection: {
        type: 'FeatureCollection',
        features,
      },
    };
  }

  return {
    tile: {z, x, y},
    layerNames,
    layers,
  };
}

async function downloadDecodeOne(url, z, x, y, outPbfDir, outJsonDir, skipErrors) {
  const pbfDir = path.join(outPbfDir, String(z), String(x));
  const jsonDir = path.join(outJsonDir, String(z), String(x));
  fs.mkdirSync(pbfDir, {recursive: true});
  fs.mkdirSync(jsonDir, {recursive: true});

  const pbfPath = path.join(pbfDir, `${y}.pbf`);
  const jsonPath = path.join(jsonDir, `${y}.json`);

  console.log(`Downloading: ${url}`);
  let pbfBuffer;
  try {
    pbfBuffer = await downloadBuffer(url);
  } catch (e) {
    if (skipErrors) {
      console.warn(`Skip ${z}/${x}/${y}:`, e?.message || e);
      return {ok: false};
    }
    throw e;
  }
  fs.writeFileSync(pbfPath, pbfBuffer);
  console.log(`Saved PBF: ${pbfPath}`);

  const decoded = decodeVectorTile(pbfBuffer, z, x, y);
  fs.writeFileSync(jsonPath, JSON.stringify(decoded, null, 2), 'utf8');
  console.log(`Saved JSON: ${jsonPath}`);
  console.log(`Layers: ${decoded.layerNames.join(', ') || '(none)'}`);
  return {ok: true};
}

async function main() {
  const outPbfDir = getArg('outPbfDir', './map/vietnam-latest');
  const outJsonDir = getArg('outJsonDir', './map/vietnam-latest/json');
  const skipErrors = hasFlag('skipErrors');

  const singleUrl = getArg('url', '').trim();
  if (singleUrl) {
    const {z, x, y} = parseTileFromUrl(singleUrl);
    await downloadDecodeOne(singleUrl, z, x, y, outPbfDir, outJsonDir, false);
    return;
  }

  if (
    !TILE_URL_TEMPLATE.includes('{x}') ||
    !TILE_URL_TEMPLATE.includes('{y}')
  ) {
    throw new Error('TILE_URL_TEMPLATE must contain {x} and {y}');
  }

  const probeUrl = buildUrlFromTemplate(TILE_URL_TEMPLATE, 0, 0);
  const {z} = parseTileFromUrl(probeUrl);
  const {xMin, xMax, yMin, yMax} = TILE_XY_RANGE;
  if (xMax < xMin || yMax < yMin) {
    throw new Error('TILE_XY_RANGE: need xMax >= xMin and yMax >= yMin');
  }

  let ok = 0;
  let fail = 0;
  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      const url = buildUrlFromTemplate(TILE_URL_TEMPLATE, x, y);
      const r = await downloadDecodeOne(
        url,
        z,
        x,
        y,
        outPbfDir,
        outJsonDir,
        skipErrors,
      );
      if (r.ok) ok++;
      else fail++;
    }
  }
  console.log(
    `Done template z=${z} x=${xMin}..${xMax} y=${yMin}..${yMax}: ok=${ok} fail=${fail}`,
  );
}

main().catch(e => {
  console.error(e?.stack || String(e));
  process.exit(1);
});
