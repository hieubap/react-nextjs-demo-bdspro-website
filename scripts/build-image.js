const fs = require('fs');
const {createCanvas} = require('canvas');
const {SphericalMercator} = require('@mapbox/sphericalmercator');

const merc = new SphericalMercator({size: 256});

const {allLines} = require('../all_lines.js');

const ZOOM = 10;

// 👉 set range tile
// const MIN_X = 807;
// const MAX_X = 820;
// const MIN_Y = 445;
// const MAX_Y = 485;

const MIN_X = 807;
const MAX_X = 820;
const MIN_Y = 445;
const MAX_Y = 485;

// tạo folder
const baseDir = `./tiles/${ZOOM}`;
if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, {recursive: true});
}

// convert lng/lat → pixel tile
function project(lng, lat, tileX, tileY) {
  const px = merc.px([lng, lat], ZOOM);
  return [px[0] - tileX * 256, px[1] - tileY * 256];
}

// check bbox line có nằm trong tile không (optimization)
function isLineInTile(line, tileBBox) {
  for (const [lng, lat] of line) {
    if (
      lng >= tileBBox[0] &&
      lng <= tileBBox[2] &&
      lat >= tileBBox[1] &&
      lat <= tileBBox[3]
    ) {
      return true;
    }
  }
  return false;
}

// draw 1 tile
function drawTile(tileX, tileY) {
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;

  const tileBBox = merc.bbox(tileX, tileY, ZOOM, false);

  for (const feature of allLines.features) {
    const geom = feature.geometry;
    if (geom.type !== 'MultiLineString') continue;

    for (const line of geom.coordinates) {
      // ⚡ skip nếu không nằm trong tile
      if (!isLineInTile(line, tileBBox)) continue;

      ctx.beginPath();

      for (let i = 0; i < line.length; i++) {
        const [lng, lat] = line[i];
        const [x, y] = project(lng, lat, tileX, tileY);

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
    }
  }

  // tạo folder theo x
  const xDir = `${baseDir}_${tileX}`;
  // if (!fs.existsSync(xDir)) {
  //   fs.mkdirSync(xDir, {recursive: true});
  // }

  // ghi file
  const filePath = `${xDir}_${tileY}.png`;

  const out = fs.createWriteStream(filePath);
  const stream = canvas.createPNGStream();

  stream.pipe(out);

  return new Promise(resolve => {
    out.on('finish', resolve);
  });
}

// ================= RUN =================

(async () => {
  for (let x = MIN_X; x <= MAX_X; x++) {
    for (let y = MIN_Y; y <= MAX_Y; y++) {
      console.log(`Drawing tile ${ZOOM}/${x}/${y}`);
      await drawTile(x, y);
    }
  }

  console.log('Done all tiles!');
})();
