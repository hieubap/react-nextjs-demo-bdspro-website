import { memo } from "react";
import {
  EyeSVG,
  MapSVG,
  MyLocationOutlineSVG,
  PenTool2SVG,
  Ruler2SVG,
  StarSVG,
} from "../Images/SVG";

const ICON_BASE = 40; // px, tương đương hotSize.width * 0.1
const hotColors = {
  white: "#fff",
  blue2: "#1E90FF",
  gray: "#999",
  icon: "#333",
};

const TOOLS = [
  { Svg: Ruler2SVG, label: "Đo", key: "measure" as const },
  { Svg: PenTool2SVG, label: "Vẽ vùng", key: "draw" as const },
  // { Svg: MapSVG, label: "Hiển thị lớp", key: "layer" as const },
  // { Svg: EyeSVG, label: "Theo dõi", key: "tracking" as const },
  // { Svg: StarSVG, label: "Đã lưu", key: "saved" as const },
] as const;

type MapControlProps = {
  onPressCurrentLocation?: () => void;
  onPressLayer?: () => void;
  onPressMeasure?: () => void;
  onPressDraw?: () => void;
  currentLocationActive?: boolean;
  layerActive?: number;
};

export const MapControlTools = memo(
  ({
    onPressCurrentLocation,
    onPressLayer,
    onPressMeasure,
    onPressDraw,
    currentLocationActive,
    layerActive,
  }: MapControlProps) => {
    const handlers = {
      location: onPressCurrentLocation,
      layer: onPressLayer,
      measure: onPressMeasure,
      draw: onPressDraw,
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <button
          style={{
            width: ICON_BASE,
            height: ICON_BASE,
            borderRadius: ICON_BASE / 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: currentLocationActive
              ? hotColors.gray
              : hotColors.blue2,
            border: "none",
            cursor: currentLocationActive ? "default" : "pointer",
          }}
          onClick={currentLocationActive ? undefined : onPressCurrentLocation}
        >
          <MyLocationOutlineSVG
            width={ICON_BASE * 0.6}
            height={ICON_BASE * 0.6}
            fill={currentLocationActive ? "#1E90FF" : "#fff"}
          />
        </button>

        <div className="rounded-full border-1 border-gray-300 overflow-hidden">
          {TOOLS.map(({ Svg, label, key }, index) => {
            return (
              <button
                key={label}
                onClick={handlers[key as keyof typeof handlers]}
                aria-label={label}
                className={`flex justify-center items-center w-10 h-10 border-b border-gray-300 bg-white cursor-pointer ${
                  layerActive === index ? "bg-blue-200" : "bg-white"
                }`}
              >
                <Svg
                  width={24}
                  height={24}
                  className={`fill-[#71717A] ${
                    layerActive === index ? "fill-blue-200" : "fill-[#71717A]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
