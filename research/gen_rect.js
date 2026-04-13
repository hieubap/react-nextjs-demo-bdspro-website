const baseZ = 16;
const baseX = 52023;//52047
const baseY = 28838;//28873

const rangeX = 24;
const rangeY = 35;

function tile2lng(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

function buildRect(z, baseX, baseY, rangeX, rangeY) {
  const minX = baseX;
  const maxX = baseX + rangeX + 1;

  const minY = baseY;
  const maxY = baseY + rangeY + 1;

  const west = tile2lng(minX, z);
  const east = tile2lng(maxX, z);
  const north = tile2lat(minY, z);
  const south = tile2lat(maxY, z);

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [[
        [west, north],
        [east, north],
        [east, south],
        [west, south],
        [west, north],
      ]],
    },
    properties: {
      z,
      baseX,
      baseY,
      rangeX,
      rangeY,
    },
  };
}

// 👉 dùng
const rect = buildRect(baseZ, baseX, baseY, rangeX, rangeY);

console.log(JSON.stringify(rect, null, 2));