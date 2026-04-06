"use client";

import { memo, useMemo } from "react";
import {
  BarChart3,
  Columns2,
  History,
  Map,
  Newspaper,
} from "lucide-react";

export interface MapActionToolbarProps {
  onPressAnalysis?: () => void;
  onPressCompare?: () => void;
  onPressHistory?: () => void;
  onPressPlanning?: () => void;
  onPressNews?: () => void;
}

const TOOLBAR_ITEMS = [
  {
    key: "planning",
    label: "Quy hoạch",
    Icon: Map,
    type: "half" as const,
    action: "onPressPlanning" as const,
  },
  {
    key: "news",
    label: "Tin tức",
    Icon: Newspaper,
    type: "half" as const,
    action: "onPressNews" as const,
  },
  {
    key: "analysis",
    label: "Phân tích",
    Icon: BarChart3,
    type: "full" as const,
    action: "onPressAnalysis" as const,
  },
  {
    key: "compare",
    label: "So sánh",
    Icon: Columns2,
    type: "full" as const,
    action: "onPressCompare" as const,
  },
  {
    key: "history",
    label: "Lịch sử",
    Icon: History,
    type: "full" as const,
    action: "onPressHistory" as const,
  },
];

const iconClass = "h-[1.1em] w-[1.1em] shrink-0 text-neutral-700";

const ToolItem = memo(function ToolItem({
  Icon,
  label,
  onPress,
  type,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  onPress?: () => void;
  type: "half" | "full";
}) {
  const flex = type === "half" ? "flex-1 min-w-0" : "min-w-0";
  return (
    <button
      type="button"
      onClick={onPress}
      aria-label={label}
      className={`inline-flex ${flex} items-center justify-center gap-1.5 rounded-[10px] border border-[#D9D9D9] bg-white px-2 py-2.5 text-xs text-neutral-800 shadow-sm transition hover:bg-neutral-50 active:opacity-80 dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800`}
    >
      <Icon className={iconClass} />
      <span className="truncate">{label}</span>
    </button>
  );
});

const MapActionToolbar = memo(function MapActionToolbar({
  onPressAnalysis,
  onPressCompare,
  onPressHistory,
  onPressPlanning,
  onPressNews,
}: MapActionToolbarProps) {
  const handlers = useMemo(
    () => ({
      onPressPlanning,
      onPressNews,
      onPressAnalysis,
      onPressCompare,
      onPressHistory,
    }),
    [
      onPressPlanning,
      onPressNews,
      onPressAnalysis,
      onPressCompare,
      onPressHistory,
    ],
  );

  const firstRow = TOOLBAR_ITEMS.slice(0, 2);
  const secondRow = TOOLBAR_ITEMS.slice(2);

  return (
    <div className="flex flex-col gap-2 px-[2vw] py-[1.2vw] sm:px-3 sm:py-2">
      <div className="flex flex-row items-center gap-[1.5vw] sm:gap-2">
        {firstRow.map((item) => (
          <ToolItem
            key={item.key}
            Icon={item.Icon}
            label={item.label}
            type="half"
            onPress={handlers[item.action]}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center gap-[1.5vw] sm:gap-2">
        {secondRow.map((item) => (
          <ToolItem
            key={item.key}
            Icon={item.Icon}
            label={item.label}
            type="full"
            onPress={handlers[item.action]}
          />
        ))}
      </div>
    </div>
  );
});

export default MapActionToolbar;
