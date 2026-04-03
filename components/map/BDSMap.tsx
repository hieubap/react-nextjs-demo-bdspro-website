"use client";

import { MapDrawing, UpdateBounds } from "@/components/map/MapDrawing";
import { useEffect, useRef, useState } from "react";
import { MapContainer, Polygon, TileLayer, useMap } from "react-leaflet";

import { useLeafletPlugins } from "@/src/map/map.hook";
import { Point } from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { tinhData } from "@/public/data/tinhVN";

function MapLogic({ drawEnabled }: { drawEnabled: boolean }) {
  const map = useMap();

  // gắn plugin + control
  useLeafletPlugins(map);

  // lock map khi vẽ
  //   if (drawEnabled) {
  //     map.dragging.disable();
  //     map.scrollWheelZoom.disable();
  //   } else {
  //     map.dragging.enable();
  //     map.scrollWheelZoom.enable();
  //   }

  return null;
}

export default function BDSMap() {
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [polygonCoords, setPolygonCoords] = useState([]);
  console.log(polygonCoords, "polygonCoordspolygonCoords");
  const boundsRef = useRef(null);
  const sizeRef = useRef<Point>(new Point(1000, 1000));
  const [points, setPoints] = useState([]);

  const fetchGeo = async () => {
    const res = await fetch("output.json");
    const data = await res.json();

    // const feature = data.ranhthua_tq[0];

    // const latCen = feature.properties.lat_cen;
    // const lonCen = feature.properties.long_cen;

    // const R = 6378137;
    // const latRad = (latCen * Math.PI) / 180;

    // // const _points = feature.geometry[0].map((p) => {
    // //   const lat = latCen + (p.y / R) * (180 / Math.PI);
    // //   const lon = lonCen + ((p.x / R) * (180 / Math.PI)) / Math.cos(latRad);

    // //   return [lat, lon];
    // // });
    // function tileToLatLng(x, y, z, tileX, tileY, extent = 4096) {
    //   const worldX = (tileX * extent + x) / (extent * Math.pow(2, z));
    //   const worldY = (tileY * extent + y) / (extent * Math.pow(2, z));

    //   const lng = worldX * 360 - 180;

    //   const n = Math.PI - 2 * Math.PI * worldY;
    //   const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));

    //   return { lat, lng };
    // }
    // function convertPolygon(feature) {
    //   const latCen = feature.properties.lat_cen;
    //   const lonCen = feature.properties.long_cen;

    //   const R = 6378137;
    //   const latRad = (latCen * Math.PI) / 180;

    //   return feature.geometry[0].map((p) => {
    //     const dx = p.x / 1000; // mm → meter
    //     const dy = p.y / 1000;

    //     const lat = latCen + (dy / R) * (180 / Math.PI);
    //     const lng = lonCen + ((dx / R) * (180 / Math.PI)) / Math.cos(latRad);

    //     return { lng, lat };
    //   });
    // }
    // const o = convertPolygon(data.ranhthua_tq[0]);
    console.log(data.features, "data.featuresdata.features");

    setPoints(
      data.features?.map((i) => [
        i.properties.lat_cen,
        i.properties.long_cen,
        i.properties.Shape_Area,
        i.geometry.coordinates[0].map((i) => ({
          lng: i[0],
          lat: i[1],
        })),
        // convertPolygon(i),
        // i.geometry[0].map((p) => {
        //   // const lat = latCen + (p.y / R) * (180 / Math.PI);
        //   // const lng = lonCen + ((p.x / R) * (180 / Math.PI)) / Math.cos(latRad);
        //   // console.log(p, lat, lng, "????");

        //   // return {
        //   //   lat,
        //   //   lng,
        //   // };
        //   // const o = tileToLatLng(p.x, p.y, 16, 52025, 28790);
        //   // console.log(o, ")))))");
        //   const scale = 0.00001;
        //   const center = [i.properties.lat_cen, i.properties.long_cen];
        //   const x0 = i.geometry[0][0].x;
        //   const y0 = i.geometry[0][0].y;

        //   const lat = center[0] + (p.y - y0) * scale;
        //   const lng = center[1] + (p.x - x0) * scale;

        //   return {
        //     lat,
        //     lng,
        //   };
        //   // return pol.map((p) => {

        //   // });
        // }),
      ])
    );

    // const map = L.map("map").setView([latCen, lonCen], 19);

    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    //   map
    // );

    // L.polygon(points, {
    //   color: "red",
    // }).addTo(map);
  };
  useEffect(() => {
    fetchGeo();
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%" }}>
      <MapContainer
        center={[21.05383524100006, 105.7860061577747]}
        zoom={22}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          maxZoom={24}
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        {
          <Polygon
            positions={[
              [21.05758621440068, 105.78182943145084],
              [21.057585290353114, 105.78182685701363],
              [21.057585219949488, 105.78182665898],
              [21.05759190653369, 105.78182665898],
              [21.05758621440068, 105.78182943145084],
            ].map((it) => ({
              lat: it[0],
              lng: it[1],
            }))}
            color="red"
            fillColor="red"
            fillOpacity={1}
          />
        }
        {points.map((poi) => (
          <>
            {/* <Marker
              position={{
                lat: poi[0],
                lng: poi[1],
              }}
            >
              <Popup>
                <b>{poi[2]}</b>
              </Popup>
            </Marker> */}
            <Polygon
              positions={poi[3]}
              color="blue"
              fillColor="blue"
              fillOpacity={0.5}
            >
              <Popup>{poi[2]}</Popup>
            </Polygon>
          </>
        ))}
        {
          <Polygon
            positions={xyToLatLng(
              [
                [14, 2670],
                [1, 2665],
                [0.0, 2664.61904761905],
                [0.0, 2700.8],
                [14, 2670],
              ],
              21.0570927730001,
              105.78182665898
            ).map((it) => ({
              lat: it[0],
              lng: it[1],
            }))}
            color="blue"
            fillColor="blue"
            fillOpacity={0.5}
          />
        }
        <Marker
          position={{
            lat: 21.0570927730001,
            lng: 105.78182665898,
          }}
        >
          <Popup>
            <b>Chính nó2</b>
          </Popup>
        </Marker>

        <MapLogic drawEnabled={drawEnabled} />

        {/* Render uutien1Data markers */}
        {/* {uutien1Data.map((data, index) => (
          <Marker key={index} position={[data[0], data[1]]}>
            <Popup>
              <b>{data[2]}</b>
              <br />
              {data[3]}
              <br />
              {data[4]}
              <br />
              {data[5]}
            </Popup>
          </Marker>
        ))} */}

        {/* Render dtvtData polygons */}
        {/* {dtvtData.features.map((feature, index) => {
          if (feature.geometry.type === "Polygon") {
            return (
              <Polygon
                key={`dtvt-${index}`}
                positions={feature.geometry.coordinates[0].map((coord) => [
                  coord[1],
                  coord[0],
                ])}
                color="green"
                fillColor="green"
                fillOpacity={0.3}
              >
                <Popup>
                  <b>{feature.properties.name}</b>
                  <br />
                  Diện tích: {feature.properties.dientich} km²
                  <br />
                  Dân số: {feature.properties.danso}
                  <br />
                  Ghi chú: {feature.properties.ghichu}
                </Popup>
              </Polygon>
            );
          }
          return null;
        })} */}

        {/* Render qhcData polygons */}
        {/* {qhcData.features.map((feature, index) => {
          if (feature.geometry.type === "Polygon") {
            return (
              <Polygon
                key={`qhc-${index}`}
                positions={feature.geometry.coordinates[0].map((coord) => [
                  coord[1],
                  coord[0],
                ])}
                color="purple"
                fill={false}
                // fillColor="purple"
                // fillOpacity={0.3}
              >
                <Popup>
                  <b>{feature.properties.name}</b>
                  <br />
                  Diện tích: {feature.properties.dientich}
                  <br />
                  Dân số: {feature.properties.danso}
                  <br />
                  Ghi chú: {feature.properties.ghichu}
                </Popup>
              </Polygon>
            );
          }
          return null;
        })} */}

        {/* Render qhpkData polygons */}
        {/* {qhpkData.features.map((feature, index) => {
          if (feature.geometry.type === "Polygon") {
            return (
              <Polygon
                key={`qhpk-${index}`}
                positions={feature.geometry.coordinates[0].map((coord) => [
                  coord[1],
                  coord[0],
                ])}
                color="orange"
                fillColor="orange"
                fillOpacity={0.3}
              >
                <Popup>
                  <b>{feature.properties.name}</b>
                  <br />
                  Diện tích: {feature.properties.dientich}
                  <br />
                  Dân số: {feature.properties.danso}
                  <br />
                  Ghi chú: {feature.properties.ghichu}
                </Popup>
              </Polygon>
            );
          }
          return null;
        })} */}

        {/* Render tinhData polygons */}
        {tinhData.features.map((feature, index) => {
          if (feature.geometry.type === "MultiPolygon") {
            return feature.geometry.coordinates.map((polygon, polyIndex) => (
              <Polygon
                key={`${index}-${polyIndex}`}
                positions={polygon[0].map((coord) => [coord[1], coord[0]])}
                color="blue"
                fill={false}
                weight={1}
                dashArray="10, 10"
              />
            ));
          }
          return null;
        })}

        {polygonCoords?.length > 0 && (
          <Polygon
            positions={polygonCoords}
            color="red"
            fillColor="red"
            fillOpacity={0.5}
          />
        )}
        <UpdateBounds boundsRef={boundsRef} sizeRef={sizeRef} />
      </MapContainer>

      {/* DRAWING OVERLAY */}
      <MapDrawing
        boundsRef={boundsRef}
        sizeRef={sizeRef}
        enabled={drawEnabled}
        onDrawingComplete={(paths) => {
          setPolygonCoords(paths);
        }}
      />

      {/* UI */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
          background: "#fff",
          padding: 8,
          borderRadius: 6,
        }}
      >
        <button onClick={() => setDrawEnabled((v) => !v)}>
          {drawEnabled ? "Tắt vẽ" : "Bật vẽ"}
        </button>
      </div>
    </div>
  );
}

const R = 6378137;

function xyToLatLng(points, latCen, lonCen) {
  const latRad = (latCen * Math.PI) / 180;

  return points.map(([x, y]) => {
    const lat = latCen + (y / R) * (180 / Math.PI);
    const lon = lonCen + ((x / R) * (180 / Math.PI)) / Math.cos(latRad);

    return [lat, lon];
  });
}
