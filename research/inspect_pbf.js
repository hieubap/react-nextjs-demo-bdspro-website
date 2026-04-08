const fs = require("fs");
const VectorTile = require("@mapbox/vector-tile").VectorTile;
const Pbf = require("pbf").default;
const https = require("http"); // hoặc http

// Thay bằng URL tile thật của bạn (zoom/x/y)
const tileUrl =
  "http://192.168.100.76:8002/v1/map/layer/tiles/8/202/113";

https.get(tileUrl, (res) => {
  const chunks = [];
  res.on("data", (chunk) => chunks.push(chunk));
  res.on("end", () => {
    const buffer = Buffer.concat(chunks);
    const tile = new VectorTile(new Pbf(buffer));

    console.log("Các layer có trong tile PBF:");
    console.log(Object.keys(tile.layers));
  });
});
