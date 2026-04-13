"use client";

import { memo, useMemo, useState } from "react";
import { BarChart3, Columns2, History, Map, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ArrowUpSVG,
  FilterSVG,
  HeroiconsNewspaperSVG,
  LayerSVG,
  MapOutlineSVG,
} from "../Images/SVG";
import styled from "styled-components";

//
// ===== TYPES
//
interface MapActionToolbarProps {
  onPressAnalysis?: () => void;
  onPressCompare?: () => void;
  onPressHistory?: () => void;
  onPressPlanning?: () => void;
  onPressNews?: () => void;
  onPressLayer?: () => void;
}

//
// ===== CONST
//
const ICON_SIZE = 36;

//
// ===== CONFIG (không inline JSX)
//
const TABS = [
  {
    key: "planning",
    label: "Quy hoạch",
    Icon: MapOutlineSVG,
  },
  {
    key: "news",
    label: "Tin tức",
    Icon: HeroiconsNewspaperSVG,
  },
];
const TOOLBAR_ITEMS = [
  [
    {
      key: "planning",
      label: "Hiển thị",
      Icon: LayerSVG,
      type: "half",
      action: "onPressLayer",
    },
    {
      key: "news",
      label: "Bộ lọc",
      Icon: FilterSVG,
      type: "half",
      action: "onPressNews",
    },
  ],
  // [
  //   {
  //     key: 'analysis',
  //     label: 'Phân tích',
  //     Icon: ChartSquareSVG,
  //     type: 'half',
  //     action: 'onPressAnalysis',
  //   },
  //   {
  //     key: 'compare',
  //     label: 'So sánh',
  //     Icon: SplitSVG,
  //     type: 'half',
  //     action: 'onPressCompare',
  //   },
  //   {
  //     key: 'history',
  //     label: 'Lịch sử',
  //     Icon: BasilHistoryOutlineSVG,
  //     type: 'half',
  //     action: 'onPressHistory',
  //   },
  // ],
];

//
// ===== ITEM
//
const ToolItem = memo(
  ({
    Icon,
    label,
    onPress,
    type,
    style,
  }: {
    Icon: any;
    label: string;
    onPress?: () => void;
    type: "half" | "full";
    style?: React.CSSProperties;
  }) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-2 py-2 cursor-pointer bg-white rounded-xl"
        )}
        onClick={onPress}
      >
        <Icon width={20} height={20} color={"#292D32"} />
        <div className="text-12">{label}</div>
      </div>
    );
  }
);

//
// ===== MAIN
//
const MapActionToolbar = ({
  onPressAnalysis,
  onPressCompare,
  onPressHistory,
  onPressPlanning,
  onPressNews,
  onPressLayer,
}: MapActionToolbarProps) => {
  //
  // ===== STABLE HANDLERS MAP
  //
  const handlers = useMemo(
    () => ({
      onPressPlanning,
      onPressNews,
      onPressAnalysis,
      onPressCompare,
      onPressHistory,
      onPressLayer,
    }),
    [
      onPressPlanning,
      onPressNews,
      onPressAnalysis,
      onPressCompare,
      onPressHistory,
      onPressLayer,
    ]
  );

  const [activeTab, setActiveTab] = useState<(typeof TABS)[0]["key"]>(
    TABS[0].key
  );
  const tabData = useMemo(() => {
    return TABS.find((tab) => tab.key === activeTab) || TABS[0];
  }, [activeTab, TABS]);

  return (
    <WrapStyled className="search-box-action flex flex-row justify-between gap-2">
      <div className="flex flex-row items-center gap-2">
        <div
          className="flex items-center gap-2 px-2 py-2 min-w-22 rounded-xl bg-[#3B82F6]"
          onClick={() => {
            setActiveTab(activeTab === "planning" ? "news" : "planning");
          }}
        >
          <tabData.Icon className="w-5 h-5 text-white" width={20} height={20} />
          <div className="text-12 text-sm text-white">{tabData.label}</div>
          <ArrowUpSVG className="w-5 h-5 text-white" />
        </div>
      </div>
      {TOOLBAR_ITEMS.map((row, index) => (
        <div key={index} className="flex flex-row items-center gap-2">
          {row.map((item) => (
            <ToolItem
              key={item.key}
              Icon={item.Icon}
              label={item.label}
              type={item.type as "half"}
              onPress={handlers[item.action as keyof typeof handlers]}
            />
          ))}
        </div>
      ))}
    </WrapStyled>
  );
};

export default memo(MapActionToolbar);

const WrapStyled = styled.div`
  .map-action-toolbar-item {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
  }
`;
