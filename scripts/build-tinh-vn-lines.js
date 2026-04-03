/**
 * Đọc tinhVN.js → trích mọi cạnh từ ranh polygon → gộp cạnh trùng (vô hướng, làm tròn tọa độ)
 * → nối thành LineString (đoạn tối đại giữa các nút bậc ≠ 2 hoặc chu trình).
 *
 * Chạy: node scripts/build-tinh-vn-lines.js
 *       NODE_OPTIONS=--max-old-space-size=8192 node scripts/build-tinh-vn-lines.js
 *
 * Mặc định ghi JSON **gọn** (không indent) — nhỏ hơn file polygon vì đã bỏ trùng ranh.
 * Pretty (debug): PRETTY_JSON=1 node scripts/build-tinh-vn-lines.js
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(
  __dirname,
  '../src/Screens/QHMapScreen/tinhVN.js',
);
const OUTPUT = path.join(
  __dirname,
  '../src/Screens/QHMapScreen/tinhVNLines.js',
);

const PRECISION = 6;

/** Cân bằng ngoặc, bỏ qua chuỗi "..." và '...' */
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

function pkey(lng, lat) {
  const r = (x) => Number(Number(x).toFixed(PRECISION));
  return `${r(lng)},${r(lat)}`;
}

function addVertex(lng, lat, vertices) {
  const k = pkey(lng, lat);
  if (!vertices.has(k)) {
    vertices.set(k, {lng: Number(lng), lat: Number(lat)});
  }
  return k;
}

function ringToUndirectedEdges(ring, vertices, edgeDedup) {
  if (!ring || ring.length < 2) {
    return;
  }
  let keys = ring.map(([lng, lat]) => addVertex(lng, lat, vertices));
  if (keys[0] === keys[keys.length - 1]) {
    keys = keys.slice(0, -1);
  }
  if (keys.length < 2) {
    return;
  }
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const u = keys[i];
    const v = keys[(i + 1) % len];
    if (u === v) {
      continue;
    }
    const [a, b] = u < v ? [u, v] : [v, u];
    const ek = `${a}@@${b}`;
    if (!edgeDedup.has(ek)) {
      edgeDedup.set(ek, {a, b});
    }
  }
}

function nextUnusedVertex(cur, prev, adj, edges) {
  const indices = adj.get(cur);
  if (!indices) {
    return null;
  }
  const candidates = [];
  for (const ei of indices) {
    const e = edges[ei];
    if (e.used) {
      continue;
    }
    const o = e.a === cur ? e.b : e.a;
    if (o === prev) {
      continue;
    }
    candidates.push({ei, o});
  }
  if (candidates.length !== 1) {
    return null;
  }
  const {ei, o} = candidates[0];
  edges[ei].used = true;
  return o;
}

function toCoord(key, vertices) {
  const p = vertices.get(key);
  return [p.lng, p.lat];
}

function dedupeConsecutiveCoords(coords) {
  const out = [];
  for (const c of coords) {
    const last = out[out.length - 1];
    if (!last || last[0] !== c[0] || last[1] !== c[1]) {
      out.push(c);
    }
  }
  return out;
}

function extractPolyline(ei, edges, adj, vertices) {
  const e = edges[ei];
  if (e.used) {
    return null;
  }
  e.used = true;
  const {a, b} = e;

  const forwardKeys = [a, b];
  let cur = b;
  let prev = a;
  while (true) {
    const nxt = nextUnusedVertex(cur, prev, adj, edges);
    if (nxt === null) {
      break;
    }
    forwardKeys.push(nxt);
    prev = cur;
    cur = nxt;
  }

  const backwardKeys = [];
  cur = a;
  prev = b;
  while (true) {
    const nxt = nextUnusedVertex(cur, prev, adj, edges);
    if (nxt === null) {
      break;
    }
    backwardKeys.push(nxt);
    prev = cur;
    cur = nxt;
  }

  const fullKeys = [...backwardKeys.reverse(), ...forwardKeys];
  return dedupeConsecutiveCoords(fullKeys.map(k => toCoord(k, vertices)));
}

function main() {
  const raw = fs.readFileSync(INPUT, 'utf8');
  const objStr = sliceExportedObject(raw, 'tinhData');
  const data = new Function(`return (${objStr})`)();

  const vertices = new Map();
  const edgeDedup = new Map();

  for (const f of data.features || []) {
    for (const poly of polygonsFromGeometry(f.geometry)) {
      for (const ring of poly) {
        ringToUndirectedEdges(ring, vertices, edgeDedup);
      }
    }
  }

  const edges = [];
  const adj = new Map();
  edgeDedup.forEach(({a, b}) => {
    const ei = edges.length;
    edges.push({a, b, used: false});
    for (const v of [a, b]) {
      if (!adj.has(v)) {
        adj.set(v, []);
      }
      adj.get(v).push(ei);
    }
  });

  const lineFeatures = [];
  for (let i = 0; i < edges.length; i++) {
    if (edges[i].used) {
      continue;
    }
    const coords = extractPolyline(i, edges, adj, vertices);
    if (!coords || coords.length < 2) {
      continue;
    }
    lineFeatures.push({
      type: 'Feature',
      properties: {
        lineIndex: lineFeatures.length,
        pointCount: coords.length,
      },
      geometry: {
        type: 'LineString',
        coordinates: coords,
      },
    });
  }

  const unused = edges.filter(e => !e.used).length;
  if (unused > 0) {
    console.warn('Cạnh chưa dùng (lạ):', unused);
  }

  const outCollection = {
    type: 'FeatureCollection',
    name: 'tinhVN-admin-boundary-lines',
    crs: data.crs || {
      type: 'name',
      properties: {name: 'urn:ogc:def:crs:OGC:1.3:CRS84'},
    },
    features: lineFeatures,
    meta: {
      source: 'tinhVN.js',
      precision: PRECISION,
      undirectedEdgeCount: edges.length,
      lineStringCount: lineFeatures.length,
    },
  };

  const pretty = process.env.PRETTY_JSON === '1';
  const body = pretty
    ? JSON.stringify(outCollection, null, 2)
    : JSON.stringify(outCollection);
  const output = `export const tinhVNLines = ${body};\n`;
  fs.writeFileSync(OUTPUT, output, 'utf8');

  const pointCount = lineFeatures.reduce(
    (s, f) => s + (f.geometry?.coordinates?.length || 0),
    0,
  );
  const bytes = Buffer.byteLength(output, 'utf8');
  const polyBytes = fs.statSync(INPUT).size;

  console.log(
    `Đã ghi ${OUTPUT}: ${edges.length} cạnh vô hướng → ${lineFeatures.length} LineString, ${pointCount} điểm`,
  );
  console.log(
    `Kích thước file: ${(bytes / 1e6).toFixed(2)} MB (polygon nguồn: ${(polyBytes / 1e6).toFixed(2)} MB)${pretty ? ' [PRETTY_JSON]' : ''}`,
  );
}

main();
