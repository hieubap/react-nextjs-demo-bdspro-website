/**
 * Đọc file .pbf (Mapbox Vector Tile từ GIS API) và xuất ra JSON
 * Không cần cài npm, chạy thẳng với Node.js
 * Usage: node read_pbf.js [input.pbf] [output.json]
 */

const fs = require("fs");

// ---- Minimal Protobuf decoder ----
function readVarint(buf, pos) {
  let result = 0, shift = 0, b;
  do {
    b = buf[pos++];
    result |= (b & 0x7f) << shift;
    shift += 7;
  } while (b & 0x80);
  return { value: result >>> 0, pos };
}

function readVarint64(buf, pos) {
  let lo = 0, hi = 0, b, shift = 0;
  for (let i = 0; i < 5; i++) {
    b = buf[pos++];
    lo |= (b & 0x7f) << shift;
    shift += 7;
    if (!(b & 0x80)) return { value: lo >>> 0, pos };
  }
  shift = 0;
  for (let i = 0; i < 5; i++) {
    b = buf[pos++];
    hi |= (b & 0x7f) << shift;
    shift += 7;
    if (!(b & 0x80)) break;
  }
  return { value: lo + hi * 4294967296, pos };
}

function readFixed32(buf, pos) {
  return { value: buf.readFloatLE(pos), pos: pos + 4 };
}

function readFixed64(buf, pos) {
  return { value: buf.readDoubleLE(pos), pos: pos + 8 };
}

function readString(buf, pos) {
  const { value: len, pos: p } = readVarint(buf, pos);
  return { value: buf.slice(p, p + len).toString("utf8"), pos: p + len };
}

function readBytes(buf, pos) {
  const { value: len, pos: p } = readVarint(buf, pos);
  return { value: buf.slice(p, p + len), pos: p + len };
}

function zigzag(n) {
  return (n >>> 1) ^ -(n & 1);
}

// ---- Parse MVT Value ----
function parseValue(buf) {
  let pos = 0, result = null;
  while (pos < buf.length) {
    const { value: tag, pos: p } = readVarint(buf, pos);
    pos = p;
    const field = tag >> 3;
    const wire = tag & 0x7;

    if      (field === 1 && wire === 2) { const r = readString(buf, pos); pos = r.pos; result = r.value; }
    else if (field === 2 && wire === 5) { const r = readFixed32(buf, pos); pos = r.pos; result = r.value; }
    else if (field === 3 && wire === 1) { const r = readFixed64(buf, pos); pos = r.pos; result = r.value; }
    else if (field === 4 && wire === 0) { const r = readVarint64(buf, pos); pos = r.pos; result = r.value; }
    else if (field === 5 && wire === 0) { const r = readVarint64(buf, pos); pos = r.pos; result = r.value; }
    else if (field === 6 && wire === 0) { const r = readVarint(buf, pos);   pos = r.pos; result = zigzag(r.value); }
    else if (field === 7 && wire === 0) { const r = readVarint(buf, pos);   pos = r.pos; result = r.value !== 0; }
    else {
      if      (wire === 0) { const r = readVarint(buf, pos);  pos = r.pos; }
      else if (wire === 1) { pos += 8; }
      else if (wire === 2) { const r = readVarint(buf, pos);  pos = r.pos + r.value; }
      else if (wire === 5) { pos += 4; }
      else break;
    }
  }
  return result;
}

// ---- Parse MVT Geometry ----
function parseGeometry(geometry, type) {
  const rings = [];
  let current = [];
  let i = 0, x = 0, y = 0;

  while (i < geometry.length) {
    const cmdInt = geometry[i++];
    const cmd   = cmdInt & 0x7;
    const count = cmdInt >> 3;

    if (cmd === 1) { // MoveTo
      if (current.length > 0) rings.push(current);
      current = [];
      for (let j = 0; j < count; j++) {
        x += zigzag(geometry[i++]);
        y += zigzag(geometry[i++]);
        current.push([x, y]);
      }
    } else if (cmd === 2) { // LineTo
      for (let j = 0; j < count; j++) {
        x += zigzag(geometry[i++]);
        y += zigzag(geometry[i++]);
        current.push([x, y]);
      }
    } else if (cmd === 7) { // ClosePath
      if (current.length > 0) {
        current.push(current[0]); // close ring
        rings.push(current);
        current = [];
      }
    }
  }
  if (current.length > 0) rings.push(current);

  // Flatten for Point / LineString, keep rings for Polygon
  if (type === 1) return rings.flat(); // Point
  if (type === 2) return rings;        // LineString
  return rings;                        // Polygon
}

// ---- Parse MVT Feature ----
function parseFeature(buf, keys, values) {
  let pos = 0, id = null, type = 0;
  const tags = [], geometry = [];

  while (pos < buf.length) {
    const { value: tag, pos: p } = readVarint(buf, pos);
    pos = p;
    const field = tag >> 3;
    const wire  = tag & 0x7;

    if (field === 1 && wire === 0) {
      const r = readVarint64(buf, pos); pos = r.pos; id = r.value;
    } else if (field === 2 && wire === 2) {
      const r = readBytes(buf, pos); pos = r.pos;
      let tp = 0;
      while (tp < r.value.length) {
        const t = readVarint(r.value, tp); tp = t.pos; tags.push(t.value);
      }
    } else if (field === 3 && wire === 0) {
      const r = readVarint(buf, pos); pos = r.pos; type = r.value;
    } else if (field === 4 && wire === 2) {
      const r = readBytes(buf, pos); pos = r.pos;
      let gp = 0;
      while (gp < r.value.length) {
        const g = readVarint(r.value, gp); gp = g.pos; geometry.push(g.value);
      }
    } else {
      if      (wire === 0) { const r = readVarint(buf, pos); pos = r.pos; }
      else if (wire === 1) { pos += 8; }
      else if (wire === 2) { const r = readVarint(buf, pos); pos = r.pos + r.value; }
      else if (wire === 5) { pos += 4; }
      else break;
    }
  }

  const properties = {};
  for (let i = 0; i + 1 < tags.length; i += 2) {
    const k = keys[tags[i]];
    const v = values[tags[i + 1]];
    if (k !== undefined) properties[k] = v;
  }

  const typeNames = { 1: "Point", 2: "LineString", 3: "Polygon" };

  return {
    ...(id !== null ? { id } : {}),
    type: typeNames[type] || type,
    properties,
    geometry: parseGeometry(geometry, type),
  };
}

// ---- Parse MVT Layer ----
function parseLayer(buf) {
  let pos = 0, name = "", version = 1, extent = 4096;
  const keys = [], values = [], features = [];

  while (pos < buf.length) {
    const { value: tag, pos: p } = readVarint(buf, pos);
    pos = p;
    const field = tag >> 3;
    const wire  = tag & 0x7;

    if      (field === 15 && wire === 0) { const r = readVarint(buf, pos);  pos = r.pos; version = r.value; }
    else if (field === 1  && wire === 2) { const r = readString(buf, pos);  pos = r.pos; name    = r.value; }
    else if (field === 3  && wire === 2) { const r = readString(buf, pos);  pos = r.pos; keys.push(r.value); }
    else if (field === 4  && wire === 2) { const r = readBytes(buf, pos);   pos = r.pos; values.push(parseValue(r.value)); }
    else if (field === 5  && wire === 0) { const r = readVarint(buf, pos);  pos = r.pos; extent  = r.value; }
    else if (field === 2  && wire === 2) {
      const r = readBytes(buf, pos); pos = r.pos;
      features.push(parseFeature(r.value, keys, values));
    } else {
      if      (wire === 0) { const r = readVarint(buf, pos); pos = r.pos; }
      else if (wire === 1) { pos += 8; }
      else if (wire === 2) { const r = readVarint(buf, pos); pos = r.pos + r.value; }
      else if (wire === 5) { pos += 4; }
      else break;
    }
  }

  return { name, version, extent, length: features.length, features };
}

// ---- Parse full MVT tile ----
function parseMVT(buf) {
  let pos = 0;
  const layers = {};

  while (pos < buf.length) {
    const { value: tag, pos: p } = readVarint(buf, pos);
    pos = p;
    const field = tag >> 3;
    const wire  = tag & 0x7;

    if (field === 3 && wire === 2) {
      const r = readBytes(buf, pos); pos = r.pos;
      const layer = parseLayer(r.value);
      layers[layer.name] = layer;
    } else {
      if      (wire === 0) { const r = readVarint(buf, pos); pos = r.pos; }
      else if (wire === 1) { pos += 8; }
      else if (wire === 2) { const r = readVarint(buf, pos); pos = r.pos + r.value; }
      else if (wire === 5) { pos += 4; }
      else break;
    }
  }

  return layers;
}

// ---- Tile coords → WGS84 ----
function tilePixelToWGS84(px, py, z, tileX, tileY, extent = 4096) {
  const size = extent * Math.pow(2, z);
  const bc = size / 360;
  const cc = size / (2 * Math.PI);

  const lng = (tileX * extent + px) / bc - 180;
  const mercY = tileY * extent + py;
  const lat = (2 * Math.atan(Math.exp((size / 2 - mercY) / cc)) - Math.PI / 2) * (180 / Math.PI);
  return [lng, lat];
}

// ---- Tính diện tích polygon WGS84 → m² (Shoelace + scale tại vĩ độ trung bình) ----
function polygonAreaM2(ring) {
  if (ring.length < 3) return 0;
  const avgLat = ring.reduce((s, p) => s + p[1], 0) / ring.length * Math.PI / 180;
  const mPerDegLat = 111132.92 - 559.82 * Math.cos(2 * avgLat) + 1.175 * Math.cos(4 * avgLat);
  const mPerDegLon = 111412.84 * Math.cos(avgLat) - 93.5 * Math.cos(3 * avgLat);
  let area = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    area += (ring[j][0] - ring[i][0]) * (ring[j][1] + ring[i][1]);
  }
  return Math.abs(area / 2) * mPerDegLat * mPerDegLon;
}

// ---- Transform tile coords → WGS84 + tính diện tích thực ----
function transformLayers(layers, z, tileX, tileY, extent = 4096) {
  for (const layer of Object.values(layers)) {
    for (const f of layer.features) {
      f.geometry = f.geometry.map(ring =>
        ring.map(([px, py]) => tilePixelToWGS84(px, py, z, tileX, tileY, extent))
      );
      if (f.geometry.length > 0) {
        f.properties["Shape_Area"] = parseFloat(polygonAreaM2(f.geometry[0]).toFixed(4));
      }
    }
  }
}

// ---- Main ----
function main() {
  const inputFile  = process.argv[2] || "response.pbf";
  const outputFile = process.argv[3] || "output.json";

  // Tile z/x/y — thay đổi nếu cần
  const TILE_Z = parseInt(process.argv[4] ?? "16");
  const TILE_X = parseInt(process.argv[5] ?? "52026");
  const TILE_Y = parseInt(process.argv[6] ?? "28844");

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Không tìm thấy file: ${inputFile}`);
    process.exit(1);
  }

  const buf = fs.readFileSync(inputFile);
  console.log(`✅ Đọc ${buf.length} bytes từ ${inputFile}`);
  console.log(`ℹ️  Tile: z=${TILE_Z}, x=${TILE_X}, y=${TILE_Y}`);

  const result = parseMVT(buf);

  const layerNames = Object.keys(result);
  if (layerNames.length === 0) {
    console.warn("⚠️  Không tìm thấy layer nào.");
  } else {
    console.log(`✅ Tìm thấy ${layerNames.length} layer(s):`);
    layerNames.forEach(n => console.log(`   - "${n}": ${result[n].length} feature(s)`));
  }

  transformLayers(result, TILE_Z, TILE_X, TILE_Y);

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), "utf8");
  console.log(`✅ Đã ghi ra ${outputFile}`);
}

main();