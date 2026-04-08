"use client";

import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Style URL (có cache-busting để dễ reload khi regenerate style.json)
  const [styleUrl] = useState(
    "http://14.225.210.29:8002/v1/map/config/style.json?_=" + Date.now()
  );
  // State để lưu tọa độ và tile z/x/y
  const [coords, setCoords] = useState({
    lat: 0,
    lng: 0,
    z: 0,
    x: 0,
    y: 0,
  });

  // Hàm tính tile từ lat/lng và zoom
  const latLngToTile = (lat: number, lng: number, zoom: number) => {
    const z = zoom;
    const x = ((lng + 180) / 360) * Math.pow(2, z);
    const y =
      ((1 -
        Math.log(
          Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
        ) /
          Math.PI) /
        2) *
      Math.pow(2, z);
    return { z, x, y };
  };

  const LAYER_CONFIGS = [
    {
      id: "ranhthua_tq_line",
      label: "Ranh thửa",
      source: {
        id: "ranhthua_tq",
        def: {
          type: "vector",
          tiles: [
            "http://14.225.210.29:8002/v1/map/mid/rt_toanquoc/{z}/{x}/{y}.pbf",
          ],
          minzoom: 16,
          maxzoom: 19,
        },
      },
      layer: {
        id: "ranhthua_tq_line",
        type: "line",
        "source-layer": "ranhthua_tq",
        paint: {
          "line-color": "#facc15",
          "line-width": [
            "interpolate",
            ["linear"],
            ["zoom"],
            12,
            0.3,
            16,
            0.8,
            20,
            1.5,
          ],
          "line-opacity": 0.7,
        },
      },
    },
    // ================= QH_SDD =================
    {
      id: "qh_sdd_raster",
      label: "Quy hoạch SDĐ",
      source: {
        id: "qh_sdd",
        def: {
          type: "raster",
          tiles: [
            "http://14.225.210.29:8002/v1/map/layer/qh_sdd/{z}/{x}/{y}.png",
          ],
          tileSize: 256, // 🔥 quan trọng
          minzoom: 0,
          maxzoom: 19,
        },
      },
      layer: {
        id: "qh_sdd_raster",
        type: "raster",
        paint: {
          "raster-opacity": 0.7, // chỉnh độ trong suốt
        },
      },
    },

    // 👉 thêm layer khác ở đây
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [105.84117, 21.0245], // Hà Nội
      zoom: 5,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: true,
    });

    mapRef.current = map;

    // Thêm nút điều khiển zoom + compass
    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: false,
      }),
      "top-right"
    );

    // ================== MAP LOAD EVENT ==================
    map.on("load", () => {
      console.log("✅ Map loaded successfully!");

      const style = map.getStyle();

      console.log("📌 Sources:", Object.keys(style.sources));
      console.log("📌 Total layers:", style.layers.length);
      console.log(
        "📌 Layer IDs:",
        style.layers.map((l: any) => l.id)
      );

      // Kiểm tra source-layer có đúng "vietnam" không
      const vectorLayers = style.layers.filter(
        (l: any) => l.type !== "background"
      );
      console.log(
        "📌 Vector layers đang dùng source-layer:",
        vectorLayers.map((l: any) => ({
          id: l.id,
          "source-layer": l["source-layer"],
        }))
      );

      // Optional: Click để xem thông tin feature
      console.log("🖱️ Click bất kỳ đâu trên map để xem thông tin features");
    });

    // Click handler - hiển thị thông tin feature
    map.on("click", (e) => {
      const features = map.queryRenderedFeatures(e.point);

      if (features.length > 0) {
        console.log(`🖱️ Clicked ${features.length} features`);
        console.dir(features[0]); // xem chi tiết feature đầu tiên
      } else {
        console.log("🖱️ Clicked nhưng không có feature nào");
      }
    });

    // Update tọa độ và tile khi di chuyển map
    map.on("mousemove", (e) => {
      const lat = e.lngLat.lat;
      const lng = e.lngLat.lng;
      const zoom = map.getZoom();
      const tile = latLngToTile(lat, lng, zoom);

      setCoords({
        lat,
        lng,
        z: tile.z,
        x: tile.x,
        y: tile.y,
      });
    });

    // Cập nhật khi zoom (float)
    map.on("zoom", () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      const tile = latLngToTile(center.lat, center.lng, zoom);
      setCoords({ lat: center.lat, lng: center.lng, ...tile });
    });

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [styleUrl]);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({});

  const toggleLayer = (map: maplibregl.Map, cfg: any) => {
    const isActive = activeLayers[cfg.id];

    // bật
    if (!isActive) {
      // add source nếu chưa có
      if (!map.getSource(cfg.source.id)) {
        map.addSource(cfg.source.id, cfg.source.def);
      }

      // add layer nếu chưa có
      if (!map.getLayer(cfg.layer.id)) {
        map.addLayer({
          ...cfg.layer,
          id: cfg.layer.id,
          source: cfg.source.id,
        });
      } else {
        map.setLayoutProperty(cfg.layer.id, "visibility", "visible");
      }
    } else {
      // tắt
      if (map.getLayer(cfg.layer.id)) {
        map.setLayoutProperty(cfg.layer.id, "visibility", "none");
      }
    }

    setActiveLayers((prev) => ({
      ...prev,
      [cfg.id]: !isActive,
    }));
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
      {/* Button toggle panel */}
      <button
        onClick={() => setShowLayerPanel(!showLayerPanel)}
        style={{
          position: "absolute",
          bottom: 12,
          right: 12,
          zIndex: 20,
          background: "#fff",
          padding: "8px 12px",
          borderRadius: 6,
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        Layers
      </button>

      {/* Panel */}
      {showLayerPanel && (
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 12,
            zIndex: 20,
            background: "#fff",
            padding: 12,
            borderRadius: 8,
            width: 200,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>Chọn layer</div>

          {LAYER_CONFIGS.map((cfg) => (
            <label key={cfg.id} style={{ display: "block", marginBottom: 6 }}>
              <input
                type="checkbox"
                checked={!!activeLayers[cfg.id]}
                onChange={() => {
                  if (!mapRef.current) return;
                  toggleLayer(mapRef.current, cfg);
                }}
              />{" "}
              {cfg.label}
            </label>
          ))}
        </div>
      )}
      {/* Debug Panel */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: "rgba(0, 0, 0, 0.75)",
          color: "white",
          padding: "12px 16px",
          borderRadius: "8px",
          fontSize: "13px",
          zIndex: 10,
          maxWidth: "320px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
          Vietnam Map Debug
        </div>
        {/* Box hiển thị tọa độ và tile */}
        <div
          style={{
            marginTop: "8px",
            borderTop: "1px solid rgba(255,255,255,0.3)",
            paddingTop: "4px",
          }}
        >
          <div>Lat: {coords.lat.toFixed(6)}</div>
          <div>Lng: {coords.lng.toFixed(6)}</div>
          <div>
            Tile z/x/y: {coords.z.toFixed(2)} / {coords.x.toFixed(2)} /{" "}
            {coords.y.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
