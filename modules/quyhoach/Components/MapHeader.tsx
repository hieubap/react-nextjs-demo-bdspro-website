import {
  BaseLineMoreHorizontalSVG,
  NotificationOutlineSVG,
  TablerSearchSVG,
} from "../Images/SVG";
import MapActionToolbar from "./MapActionToolbar";

const MapHeader = ({
  onPressAnalysis,
  onPressCompare,
  onPressHistory,
  onPressPlanning,
  onPressNews,
  onPressLayer,
}: {
  onPressAnalysis: () => void;
  onPressCompare: () => void;
  onPressHistory: () => void;
  onPressPlanning: () => void;
  onPressNews: () => void;
  onPressLayer: () => void;
}) => {
  return (
    <div className="flex flex-wrap px-4 py-2 gap-2 justify-between">
      <div
        className="flex search-box-container items-center bg-white rounded-[15px] gap-2 px-4"
        style={{
          boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.1)",
          borderRadius: "50px",
        }}
      >
        <BaseLineMoreHorizontalSVG />
        <TablerSearchSVG width={24} height={24} />
        <div className="flex-1">
          <input
            className="w-full py-3"
            type="text"
            placeholder="Tìm thửa / địa chỉ / mã QG..."
          />
        </div>
        <NotificationOutlineSVG />
      </div>
      <MapActionToolbar
        onPressAnalysis={onPressAnalysis}
        onPressCompare={onPressCompare}
        onPressHistory={onPressHistory}
        onPressPlanning={onPressPlanning}
        onPressNews={onPressNews}
        onPressLayer={onPressLayer}
      />
    </div>
  );
};

export default MapHeader;
