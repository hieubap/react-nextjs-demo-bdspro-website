/**
 * Gộp các Feature trùng mã ISO3166_2_CODE (hoặc Name_EN) thành một feature,
 * geometry: MultiPolygon với coordinates = nối tất cả polygon từ các bản ghi trùng.
 *
 * Chạy: node scripts/dedupe-tinh-vn.js
 * (có thể cần NODE_OPTIONS=--max-old-space-size=8192)
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(
  __dirname,
  '../src/Screens/QHMapScreen/tinhVN.js',
);

/** Lấy chuỗi object gốc từ `export const tinhData = { ... };` (cân bằng ngoặc, bỏ qua chuỗi). */
function sliceTinhDataObject(src) {
  const re = /export\s+const\s+tinhData\s*=\s*/;
  const m = src.match(re);
  if (!m) {
    throw new Error('Không tìm thấy export const tinhData =');
  }
  let i = m.index + m[0].length;
  while (i < src.length && /\s/.test(src[i])) {
    i++;
  }
  if (src[i] !== '{') {
    throw new Error('Sau tinhData = không phải {');
  }
  let depth = 0;
  let inString = false;
  let escape = false;
  const start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === '\\') {
        escape = true;
      } else if (c === '"') {
        inString = false;
      }
      continue;
    }
    if (c === '"') {
      inString = true;
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
  throw new Error('Không đóng được object tinhData');
}

function polygonsFromGeometry(geometry) {
  if (!geometry || !geometry.type) {
    return [];
  }
  if (geometry.type === 'Polygon') {
    return [geometry.coordinates];
  }
  if (geometry.type === 'MultiPolygon') {
    return [...geometry.coordinates];
  }
  return [];
}

function mergeGroup(features) {
  const first = features[0];
  const all = [];
  for (const f of features) {
    all.push(...polygonsFromGeometry(f.geometry));
  }
  if (all.length === 0) {
    return {...first, geometry: first.geometry};
  }
  let geometry;
  if (all.length === 1) {
    geometry = {type: 'Polygon', coordinates: all[0]};
  } else {
    geometry = {type: 'MultiPolygon', coordinates: all};
  }
  return {
    type: 'Feature',
    properties: {...first.properties},
    geometry,
  };
}

function dedupeKey(f) {
  const p = f.properties || {};
  return (
    p.ISO3166_2_CODE ||
    p.Name_EN ||
    p.Name_VI ||
    `__idx_${Math.random()}`
  );
}

function main() {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const objStr = sliceTinhDataObject(raw);
  // Object literal JS (key không quote), không phải JSON.parse được
  const data = new Function(`return (${objStr})`)();

  if (!data.features || !Array.isArray(data.features)) {
    throw new Error('Không có features[]');
  }

  const groups = new Map();
  for (const f of data.features) {
    const k = dedupeKey(f);
    if (!groups.has(k)) {
      groups.set(k, []);
    }
    groups.get(k).push(f);
  }

  const mergedFeatures = [];
  for (const [, list] of groups) {
    mergedFeatures.push(mergeGroup(list));
  }

  const outData = {
    ...data,
    features: mergedFeatures,
  };

  // Ghi lại dạng gần giữ nguyên: object literal có key quote (JSON.stringify)
  const body = JSON.stringify(outData, null, 2);
  const output = `export const tinhData = ${body};\n`;
  fs.writeFileSync(INPUT, output, 'utf8');

  console.log(
    `Trước: ${data.features.length} features → Sau: ${mergedFeatures.length} features (đã ghi ${INPUT})`,
  );
}

main();
