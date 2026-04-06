"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl, {
  Map,
  NavigationControl,
  ScaleControl,
  StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import MapControlLayer from "@/src/map/MapControlLayer";

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Thay các giá trị này cho phù hợp với hạ tầng của bạn
const STYLE_JSON_URL = "http://14.225.210.29:8002/v1/map/config/style.json"; // hoặc URL đầy đủ
const DEFAULT_CENTER: [number, number] = [105.8412, 21.0245]; // Hà Nội
const DEFAULT_ZOOM = 12;
const DEFAULT_MIN_ZOOM = 0;
const DEFAULT_MAX_ZOOM = 22;

const OVERLAY_LAYER_IDS = [
  "province_boundary_line",
  "ward_boundary_line",
  "ranhthua_tq_line",
] as const;

// ─────────────────────────────────────────────────────────────────────────────

interface MapInfo {
  zoom: number;
  center: { lng: number; lat: number };
  bearing: number;
  pitch: number;
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapInfo, setMapInfo] = useState<MapInfo>({
    zoom: DEFAULT_ZOOM,
    center: { lng: DEFAULT_CENTER[0], lat: DEFAULT_CENTER[1] },
    bearing: 0,
    pitch: 0,
  });
  const [styleLoaded, setStyleLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [layerCount, setLayerCount] = useState(0);
  const [sourceCount, setSourceCount] = useState(0);
  const [overlayProgress, setOverlayProgress] = useState(0.65);
  const [currentLocationActive, setCurrentLocationActive] = useState(false);
  const [overlayLayersVisible, setOverlayLayersVisible] = useState(true);

  // Cập nhật HUD khi bản đồ di chuyển
  const updateMapInfo = useCallback((map: Map) => {
    const center = map.getCenter();
    setMapInfo({
      zoom: Math.round(map.getZoom() * 100) / 100,
      center: {
        lng: Math.round(center.lng * 100000) / 100000,
        lat: Math.round(center.lat * 100000) / 100000,
      },
      bearing: Math.round(map.getBearing() * 10) / 10,
      pitch: Math.round(map.getPitch() * 10) / 10,
    });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let map: Map;

    const initMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load style.json từ server / public folder
        const styleRes = await fetch(STYLE_JSON_URL);
        if (!styleRes.ok) {
          throw new Error(
            `Không tải được style.json: ${styleRes.status} ${styleRes.statusText}`
          );
        }
        const style: StyleSpecification = await styleRes.json();

        // Patch sprite & glyphs nếu dùng đường dẫn tương đối
        if (style.sprite && !style.sprite.startsWith("http")) {
          style.sprite = window.location.origin + style.sprite;
        }
        if (style.glyphs && !style.glyphs.startsWith("http")) {
          style.glyphs = window.location.origin + style.glyphs;
        }

        // Khởi tạo bản đồ MapLibre
        map = new maplibregl.Map({
          container: mapContainer.current!,
          style,
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          minZoom: DEFAULT_MIN_ZOOM,
          maxZoom: DEFAULT_MAX_ZOOM,
          attributionControl: false,
          antialias: true,
        });

        mapRef.current = map;

        // Controls — giống Android MapLibre
        map.addControl(
          new NavigationControl({ visualizePitch: true }),
          "top-right"
        );
        map.addControl(new ScaleControl({ unit: "metric" }), "bottom-left");
        map.addControl(
          new maplibregl.AttributionControl({ compact: true }),
          "bottom-right"
        );

        // Sự kiện
        map.on("load", () => {
          setStyleLoaded(true);
  setLoading(false);

  const style = map.getStyle();
  setLayerCount(style.layers?.length ?? 0);
  setSourceCount(Object.keys(style.sources ?? {}).length);

  updateMapInfo(map);

  // ─── ADD VECTOR SOURCES ─────────────────────────────
  map.addSource("province_boundary", {
    type: "vector",
    tiles: ["http://14.225.210.29:8002/v1/map/layer/province_boundary/{z}/{x}/{y}"], // 👈 thay bằng URL thật
    minzoom: 0,
    maxzoom: 14,
  });

  map.addSource("ward_boundary", {
    type: "vector",
    tiles: ["http://14.225.210.29:8002/v1/map/layer/ward_boundary/{z}/{x}/{y}"], // 👈 thay bằng URL thật
    minzoom: 0,
    maxzoom: 16,
  });
  map.addSource("ranhthua_tq", {
    type: "vector",
    tiles: ["https://mapv3.meeymap.com/data/HT_TOANQUOC/{z}/{x}/{y}.pbf"], // 👈 thay bằng URL thật
    minzoom: 16,
    maxzoom: 19,
  });


  // ─── ADD LAYERS ─────────────────────────────────────
  map.addLayer({
    id: "province_boundary_line",
    type: "line",
    source: "province_boundary",
    "source-layer": "province_boundary",
    paint: {
      "line-color": "#ef4444", // 🔴 đỏ rõ hơn
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        5, 1,
        10, 2,
        15, 4
      ],
      "line-opacity": 0.9,
    },
  });
  
  map.addLayer({
    id: "ward_boundary_line",
    type: "line",
    source: "ward_boundary",
    "source-layer": "ward_boundary",
    paint: {
      "line-color": "#22d3ee", // 🔵 xanh cyan sáng
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        8, 0.5,
        12, 1.2,
        16, 2
      ],
      "line-opacity": 0.85,
    },
  });
  
  map.addLayer({
    id: "ranhthua_tq_line",
    type: "line",
    source: "ranhthua_tq",
    "source-layer": "ranhthua_tq",
    paint: {
      "line-color": "#facc15", // 🟡 vàng nổi bật
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        12, 0.3,
        16, 0.8,
        20, 1.5
      ],
      "line-opacity": 0.7,
    },
  });

  // cập nhật lại stats
  setLayerCount(map.getStyle().layers?.length ?? 0);
  setSourceCount(Object.keys(map.getStyle().sources ?? {}).length);
        });

        map.on("move", () => updateMapInfo(map));
        map.on("zoom", () => updateMapInfo(map));
        map.on("rotate", () => updateMapInfo(map));
        map.on("pitch", () => updateMapInfo(map));

        map.on("error", (e) => {
          console.error("MapLibre error:", e);
          // Chỉ báo lỗi nghiêm trọng, bỏ qua lỗi tile 404 lẻ tẻ
          if (e.error?.message && !e.error.message.includes("404")) {
            setError(e.error.message);
          }
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setLoading(false);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [updateMapInfo]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.loaded() || !styleLoaded) return;
    const o = 0.15 + overlayProgress * 0.75;
    for (const id of OVERLAY_LAYER_IDS) {
      if (!map.getLayer(id)) continue;
      try {
        map.setPaintProperty(id, "line-opacity", o);
      } catch {
        /* layer may not support paint prop */
      }
    }
  }, [overlayProgress, styleLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.loaded() || !styleLoaded) return;
    const vis = overlayLayersVisible ? "visible" : "none";
    for (const id of OVERLAY_LAYER_IDS) {
      if (!map.getLayer(id)) continue;
      try {
        map.setLayoutProperty(id, "visibility", vis);
      } catch {
        /* ignore */
      }
    }
  }, [overlayLayersVisible, styleLoaded]);

  const onChangeOverlayProgress = useCallback((value: number) => {
    setOverlayProgress(value);
  }, []);

  const onPressCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt không hỗ trợ định vị");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const map = mapRef.current;
        if (!map) return;
        map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: Math.max(map.getZoom(), 14),
          duration: 1200,
        });
        setCurrentLocationActive(true);
      },
      () => {
        setCurrentLocationActive(false);
        setError("Không lấy được vị trí hiện tại");
      },
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  }, []);

  const onPressLayer = useCallback(() => {
    setOverlayLayersVisible((v) => !v);
  }, []);

  const onPressMeasure = useCallback(() => {
    console.info("[map v2] Đo khoảng cách — tích hợp sau");
  }, []);

  const onPressDraw = useCallback(() => {
    console.info("[map v2] Vẽ vùng — tích hợp sau");
  }, []);

  const logToolbar = useCallback((name: string) => {
    console.info(`[map v2] ${name}`);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "#0f1923",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        overflow: "hidden",
      }}
    >
      {/* ── Bản đồ ── */}
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />

      {/* <MapControlLayer
        progress={overlayProgress}
        onChangeProgress={onChangeOverlayProgress}
        onPressCurrentLocation={onPressCurrentLocation}
        onPressLayer={onPressLayer}
        onPressMeasure={onPressMeasure}
        onPressDraw={onPressDraw}
        currentLocationActive={currentLocationActive}
        onPressAnalysis={() => logToolbar("Phân tích")}
        onPressCompare={() => logToolbar("So sánh")}
        onPressHistory={() => logToolbar("Lịch sử")}
        onPressPlanning={() => logToolbar("Quy hoạch")}
        onPressNews={() => logToolbar("Tin tức")}
        visible={!loading}
      /> */}

      {/* ── Loading overlay ── */}
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15,25,35,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            zIndex: 1000,
          }}
        >
          <Spinner />
          <span style={{ color: "#7dd3fc", fontSize: 13, letterSpacing: 2 }}>
            LOADING TILES…
          </span>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div
          style={{
            position: "absolute",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#7f1d1d",
            border: "1px solid #ef4444",
            color: "#fca5a5",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 12,
            maxWidth: "80vw",
            zIndex: 900,
            letterSpacing: 0.5,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* ── HUD — góc trái trên ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 500,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {/* Logo / title */}
        <div
          style={{
            background: "rgba(10,20,30,0.85)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(125,211,252,0.25)",
            borderRadius: 8,
            padding: "8px 14px",
            color: "#7dd3fc",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 3,
          }}
        >
          MAPLIBRE · PBF
        </div>

        {/* Stats */}
        {styleLoaded && (
          <div
            style={{
              background: "rgba(10,20,30,0.82)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(125,211,252,0.15)",
              borderRadius: 8,
              padding: "8px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
            <StatRow label="LAT" value={mapInfo.center.lat} />
            <StatRow label="LNG" value={mapInfo.center.lng} />
            <StatRow label="ZOOM" value={mapInfo.zoom} />
            <StatRow label="BEARING" value={`${mapInfo.bearing}°`} />
            <StatRow label="PITCH" value={`${mapInfo.pitch}°`} />
            <div
              style={{
                borderTop: "1px solid rgba(125,211,252,0.1)",
                marginTop: 4,
                paddingTop: 4,
              }}
            />
            <StatRow label="LAYERS" value={layerCount} accent />
            <StatRow label="SOURCES" value={sourceCount} accent />
          </div>
        )}
      </div>

      {/* ── Style indicator ── */}
      <div
        style={{
          position: "absolute",
          bottom: 30,
          right: 120,
          zIndex: 500,
          background: "rgba(10,20,30,0.75)",
          backdropFilter: "blur(6px)",
          border: "1px solid rgba(125,211,252,0.12)",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 10,
          color: styleLoaded ? "#4ade80" : "#f59e0b",
          letterSpacing: 1,
        }}
      >
        {styleLoaded ? "● STYLE READY" : "○ LOADING STYLE"}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
      <span style={{ color: "#475569", fontSize: 10 }}>{label}</span>
      <span
        style={{
          color: accent ? "#7dd3fc" : "#e2e8f0",
          fontWeight: accent ? 700 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Spinner() {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        border: "3px solid rgba(125,211,252,0.15)",
        borderTop: "3px solid #7dd3fc",
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}