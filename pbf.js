const fs = require("fs");
const Pbf = require("pbf").default;
const { VectorTile } = require("@mapbox/vector-tile");

const EXTENT = 4096;

function tile2lng(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y, z) {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

function convertGeometry(geom, tileX, tileY, zoom) {
  return geom.map((ring) =>
    ring.map((p) => {
      const gx = tileX * EXTENT + p.x;
      const gy = tileY * EXTENT + p.y;

      const lng = tile2lng(gx / EXTENT, zoom);
      const lat = tile2lat(gy / EXTENT, zoom);

      return [lng, lat];
    })
  );
}

function pbfToGeoJSON(input, output, tileX, tileY, zoom) {
  const data = fs.readFileSync(input);

  const tile = new VectorTile(new Pbf(data));

  const features = [];

  for (const layerName in tile.layers) {
    const layer = tile.layers[layerName];

    for (let i = 0; i < layer.length; i++) {
      const feature = layer.feature(i);

      const geom = feature.loadGeometry();

      const coords = convertGeometry(geom, tileX, tileY, zoom);

      features.push({
        type: "Feature",
        properties: feature.properties,
        geometry: {
          type: "Polygon",
          coordinates: coords,
        },
      });
    }
  }

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  fs.writeFileSync(output, JSON.stringify(geojson, null, 2));
}

pbfToGeoJSON(
  "response.pbf",
  "output.geojson",
  52026, // tileX
  28844, // tileY
  16 // zoom
);


// 28544,51529
// 29034,51536
// 29023,52374
// 28557,52361

// 28544,51529 = 414050
// 29034,52374