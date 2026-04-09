"use client";

import { memo } from "react";
import { Crosshair, Layers, Map, PenLine, Ruler } from "lucide-react";
import MapActionToolbar from "./MapActionToolbar";
import MapProgressSlider from "./MapProgressSlider";
import MapHeader from "./MapHeader";
import { MapControlTools } from "./MapControlTools";

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
    <div className={`absolute inset-0 pointer-events-none`}>
      <div className="absolute top-0 left-0 right-0 pointer-events-auto">
        <MapHeader
          onPressAnalysis={onPressAnalysis}
          onPressCompare={onPressCompare}
          onPressHistory={onPressHistory}
          onPressPlanning={onPressPlanning}
          onPressNews={onPressNews}
        />
      </div>

      <div className="absolute bottom-[10px] right-2 pointer-events-auto pb-4">
        <MapControlTools
          onPressCurrentLocation={onPressCurrentLocation}
          onPressLayer={onPressLayer}
          onPressMeasure={onPressMeasure}
          onPressDraw={onPressDraw}
          currentLocationActive={currentLocationActive}
        />
      </div>

      <div className="absolute bottom-0 left-[10px] pb-4 w-[60vw] pointer-events-auto pl-4 pb-4">
        <MapProgressSlider
          progress={progress}
          onChangeProgress={onChangeProgress}
        />
      </div>
    </div>
  );
});

export default MapControlLayer;
