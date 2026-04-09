"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import MapControlLayer from "./Components/MapControlLayer";
import PickLayerModal, { MapTooltipHandle } from "./Components/PickLayerModal";
import { dtvtData } from "@/public/data/dtvt";

const MapGLView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // Style URL (có cache-busting để dễ reload khi regenerate style.json)
  const [styleUrl] = useState(
    "http://14.225.210.29:8002/v1/map/config/style.json?_=" + Date.now()
  );
  const pickLayerModalRef = useRef<MapTooltipHandle>(null);
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
          maxzoom: 16,
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
    {
      id: "admin_boundary",
      label: "Đơn vị hành chính",
      source: {
        id: "admin_boundary",
        def: {
          type: "vector",
          tiles: [
            "http://14.225.210.29:8002/v1/map/layer/boundary/{z}/{x}/{y}.pbf",
          ],
          minzoom: 4,
          maxzoom: 12,
        },
      },

      layers: [
        // ================= PROVINCE FILL =================
        {
          id: "admin_province_fill",
          type: "fill",
          "source-layer": "province_boundary",
          maxzoom: 9,
          paint: {
            "fill-color": "#ff0000",
            "fill-opacity": 0.08, // 🔥 nhẹ thôi
          },
        },

        // ================= PROVINCE LINE =================
        {
          id: "admin_province_line",
          type: "line",
          "source-layer": "province_boundary",
          maxzoom: 9,
          paint: {
            "line-color": "#ff0000",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              4,
              0.5,
              8,
              1.5,
              12,
              3,
            ],
          },
        },

        // ================= PROVINCE LABEL =================
        {
          id: "admin_province_label",
          type: "symbol",
          "source-layer": "province_boundary",
          maxzoom: 9,
          layout: {
            "text-field": ["get", "ten_tinh"],
            "text-size": ["interpolate", ["linear"], ["zoom"], 4, 10, 8, 14],
          },
          paint: {
            "text-color": "#f00",
            "text-halo-color": "#fff",
            "text-halo-width": 1,
          },
        },

        // ================= WARD FILL =================
        {
          id: "admin_ward_fill",
          type: "fill",
          "source-layer": "ward_boundary",
          minzoom: 9,
          paint: {
            "fill-color": "#0066ff",
            "fill-opacity": 0.05,
          },
        },

        // ================= WARD LINE =================
        {
          id: "admin_ward_line",
          type: "line",
          "source-layer": "ward_boundary",
          minzoom: 9,
          paint: {
            "line-color": "#0066ff",
            "line-width": [
              "interpolate",
              ["linear"],
              ["zoom"],
              9,
              0.3,
              12,
              1.2,
            ],
          },
        },

        // ================= WARD LABEL =================
        {
          id: "admin_ward_label",
          type: "symbol",
          "source-layer": "ward_boundary",
          minzoom: 10,
          layout: {
            "text-field": ["get", "ten_xa"], // 🔥 sửa đúng key
            "text-size": ["interpolate", ["linear"], ["zoom"], 10, 10, 12, 12],
          },
          paint: {
            "text-color": "#00f",
            "text-halo-color": "#fff",
            "text-halo-width": 1,
          },
        },
      ],
    },
    {
      id: "dtvt_polygon",
      label: "Đô thị vệ tinh",
      source: {
        id: "dtvt_source",
        def: {
          type: "geojson",
          data: dtvtData, // 👈 dữ liệu của bạn
        },
      },
      layers: [
        {
          id: "dtvt_fill",
          type: "fill",
          paint: {
            "fill-color": [
              "match",
              ["get", "quyhoach"],

              "dtvt",
              "#22c55e", // xanh lá
              "phan_khu",
              "#f97316", // cam

              "rgba(0,0,0,0)", // default (nếu không match)
            ],
            "fill-opacity": 0.1,
          },
        },
        {
          id: "dtvt_outline",
          type: "line",
          paint: {
            "line-color": [
              "match",
              ["get", "quyhoach"],

              "dtvt",
              "#16a34a", // xanh lá
              "qh_chung",
              "#1d4ed8", // xanh dương
              "phan_khu",
              "#ea580c", // cam

              "rgba(0,0,0,0)", // default
            ],
            "line-width": 2,
          },
        },
      ],
    },
    // 👉 thêm layer khác ở đây
  ];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [105.84117, 21.0245], // Hà Nội
      zoom: 7,
      minZoom: 4,
      maxZoom: 18,
      attributionControl: false,
    });

    mapRef.current = map;

    // Thêm nút điều khiển zoom + compass
    // map.addControl(
    //   new maplibregl.NavigationControl({
    //     visualizePitch: false,
    //   }),
    //   "bottom-left"
    // );

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
    // map.on("mousemove", (e) => {
    //   const lat = e.lngLat.lat;
    //   const lng = e.lngLat.lng;
    //   const zoom = map.getZoom();
    //   const tile = latLngToTile(lat, lng, zoom);

    //   setCoords({
    //     lat,
    //     lng,
    //     z: tile.z,
    //     x: tile.x,
    //     y: tile.y,
    //   });
    // });

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

  const toggleLayer = (
    map: maplibregl.Map | null,
    cfg: any,
    forceState?: boolean // true = bật, false = tắt
  ) => {
    if (!map) return;

    const current = activeLayers[cfg.id] ?? false;
    const next = forceState ?? !current;

    const layers = cfg.layers || [cfg.layer];

    // 👉 BẬT layer
    if (next) {
      // add source nếu chưa có
      if (!map.getSource(cfg.source.id)) {
        map.addSource(cfg.source.id, cfg.source.def);
      }

      for (const layer of layers) {
        if (!map.getLayer(layer.id)) {
          map.addLayer({
            ...layer,
            source: cfg.source.id, // 👈 fix chỗ này
          });
        } else {
          map.setLayoutProperty(layer.id, "visibility", "visible");
        }
      }
    }

    // 👉 TẮT layer
    else {
      for (const layer of layers) {
        if (map.getLayer(layer.id)) {
          map.setLayoutProperty(layer.id, "visibility", "none");
        }
      }
    }

    // update state
    setActiveLayers((prev) => ({
      ...prev,
      [cfg.id]: next,
    }));
  };

  return (
    <div style={{ width: "100%", height: "100dvh", position: "relative" }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />

      <MapControlLayer
        onPressLayer={() => {
          pickLayerModalRef.current?.open();
          console.log("press layer...");
        }}
        progress={0}
        onChangeProgress={() => {}}
        onPressCurrentLocation={() => {}}
        onPressMeasure={() => {}}
        onPressDraw={() => {}}
      />
      <PickLayerModal
        ref={pickLayerModalRef}
        onClose={() => {}}
        onSelectBaseMap={() => {}}
        onSelectLayer={(id: string) => {
          if (!mapRef.current) return;

          ["ranhthua_tq_line", "qh_sdd_raster", "dtvt_polygon"].forEach(
            (layerId) => {
              const cfg = LAYER_CONFIGS.find((cfg) => cfg.id === layerId);
              console.log("cfg", cfg, layerId === id);
              if (!cfg) return;
              toggleLayer(mapRef.current, cfg, layerId === id);
            }
          );
        }}
        onShowPlanningLayer={() => {
          toggleLayer(
            mapRef.current,
            LAYER_CONFIGS.find((cfg) => cfg.id === "admin_boundary")
          );
        }}
      />
    </div>
  );
};

export default MapGLView;
