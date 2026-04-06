"use client";

import { memo } from "react";
import { Crosshair, Layers, Map, PenLine, Ruler } from "lucide-react";
import MapActionToolbar from "./MapActionToolbar";
import MapProgressSlider from "./MapProgressSlider";

export interface MapControlLayerProps {
  progress: number;
  onChangeProgress: (value: number) => void;
  onPressCurrentLocation: () => void;
  onPressLayer: () => void;
  onPressMeasure: () => void;
  onPressDraw: () => void;
  currentLocationActive?: boolean;
  onPressAnalysis: () => void;
  onPressCompare: () => void;
  onPressHistory: () => void;
  onPressPlanning: () => void;
  onPressNews: () => void;
  visible?: boolean;
}

const TOOLS = [
  { Icon: Crosshair, label: "Vị trí hiện tại", key: "location" as const },
  { Icon: Layers, label: "Hiển thị lớp", key: "layer" as const },
  { Icon: Ruler, label: "Đo", key: "measure" as const },
  { Icon: PenLine, label: "Vẽ vùng", key: "draw" as const },
] as const;

const MapV2Header = memo(function MapV2Header() {
  return (
    <header className="flex items-center gap-2 border-b border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md sm:px-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Map className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-sky-100">
          Bản đồ quy hoạch
        </p>
        <p className="truncate text-[11px] text-sky-200/70">Map v2</p>
      </div>
    </header>
  );
});

const MapControlTools = memo(function MapControlTools({
  onPressCurrentLocation,
  onPressLayer,
  onPressMeasure,
  onPressDraw,
  currentLocationActive,
}: Pick<
  MapControlLayerProps,
  | "onPressCurrentLocation"
  | "onPressLayer"
  | "onPressMeasure"
  | "onPressDraw"
  | "currentLocationActive"
>) {
  const handlers = {
    location: onPressCurrentLocation,
    layer: onPressLayer,
    measure: onPressMeasure,
    draw: onPressDraw,
  };

  return (
    <div className="pointer-events-none absolute bottom-[3vw] right-[3vw] z-[510] flex flex-col gap-[2vw] sm:bottom-4 sm:right-4 sm:gap-3">
      {TOOLS.map(({ Icon, label, key }) => {
        const locationFocused = key === "location" && currentLocationActive;
        const sizeClass = locationFocused
          ? "h-[min(7.4vw,44px)] w-[min(7.4vw,44px)]"
          : "h-[min(6vw,40px)] w-[min(6vw,40px)]";
        const btnSize =
          "min-h-[min(10vw,48px)] min-w-[min(10vw,48px)] sm:min-h-12 sm:min-w-12";
        return (
          <button
            key={key}
            type="button"
            style={{ pointerEvents: "auto" }}
            onClick={handlers[key]}
            aria-label={label}
            aria-pressed={key === "location" ? locationFocused : undefined}
            className={`${btnSize} inline-flex items-center justify-center rounded-full border-[0.35vw] shadow-md transition active:scale-95 sm:border-2 ${
              locationFocused
                ? "border-red-500 bg-white text-red-500"
                : "border-blue-600 bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            <Icon className={`${sizeClass} shrink-0`} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
});

const MapControlLayer = memo(function MapControlLayer({
  progress,
  onChangeProgress,
  onPressCurrentLocation,
  onPressLayer,
  onPressMeasure,
  onPressDraw,
  currentLocationActive,
  onPressAnalysis,
  onPressCompare,
  onPressHistory,
  onPressPlanning,
  onPressNews,
  visible = true,
}: MapControlLayerProps) {
  return (
    <div
      className={`absolute inset-0 z-[500] pointer-events-none ${visible ? "" : "invisible"}`}
      aria-hidden={!visible}
    >
      <div className="pointer-events-auto absolute inset-0 flex flex-col justify-between">
        <div className="pointer-events-none z-[520]">
          <div className="pointer-events-auto">
            <MapV2Header />
            <MapActionToolbar
              onPressAnalysis={onPressAnalysis}
              onPressCompare={onPressCompare}
              onPressHistory={onPressHistory}
              onPressPlanning={onPressPlanning}
              onPressNews={onPressNews}
            />
          </div>
        </div>

        <MapControlTools
          onPressCurrentLocation={onPressCurrentLocation}
          onPressLayer={onPressLayer}
          onPressMeasure={onPressMeasure}
          onPressDraw={onPressDraw}
          currentLocationActive={currentLocationActive}
        />

        <footer className="pointer-events-auto z-[510] mx-[6vw] mb-[6vw] mr-[25vw] rounded-xl sm:mx-6 sm:mb-6 sm:mr-24">
          <MapProgressSlider
            progress={progress}
            onChangeProgress={onChangeProgress}
          />
        </footer>
      </div>
    </div>
  );
});

export default MapControlLayer;
