"use client";

import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);

export interface MapProgressSliderProps {
  progress: number;
  onChangeProgress?: (value: number) => void;
}

const MapProgressSlider = memo(function MapProgressSlider({
  progress,
  onChangeProgress,
}: MapProgressSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [localP, setLocalP] = useState(clamp01(progress));
  const [label, setLabel] = useState(
    `${Math.round(clamp01(progress) * 100)}%`,
  );

  useLayoutEffect(() => {
    if (!dragging) setLocalP(clamp01(progress));
  }, [progress, dragging]);

  useEffect(() => {
    setLabel(`${Math.round(localP * 100)}%`);
  }, [localP]);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setWidth(el.getBoundingClientRect().width);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const setFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = rect.width;
      if (w <= 0) return;
      const x = clientX - rect.left;
      setLocalP(clamp01(x / w));
    },
    [],
  );

  const commit = useCallback(() => {
    onChangeProgress?.(localP);
  }, [localP, onChangeProgress]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current?.hasPointerCapture(e.pointerId)) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (containerRef.current?.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    commit();
  };

  const thumbX = width > 0 ? localP * width : 0;
  const thumbPx = 26;
  const trackH = 8;

  return (
    <div
      ref={containerRef}
      className="relative flex w-full cursor-pointer touch-none select-none items-center py-2"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(localP * 100)}
      aria-label="Tiến độ lớp"
    >
      <div
        className="w-full rounded-full border border-neutral-300 bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-700"
        style={{ height: trackH }}
      />
      <div
        className="pointer-events-none absolute left-0 rounded-full bg-blue-600"
        style={{
          height: trackH,
          width: thumbX,
        }}
      />
      <div
        className="pointer-events-none absolute flex w-12 flex-col items-center"
        style={{
          left: thumbX,
          transform: "translateX(-50%)",
          bottom: thumbPx / 2 + 6,
          opacity: dragging ? 1 : 0,
          transition: "opacity 0.15s ease",
        }}
      >
        <div className="flex h-[26px] w-12 items-center justify-center rounded-lg bg-[#1a1a1a] text-[11px] font-medium tracking-wide text-white">
          {label}
        </div>
        <div
          className="h-0 w-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-[#1a1a1a]"
          aria-hidden
        />
      </div>
      <div
        className="pointer-events-none absolute rounded-full bg-blue-600 shadow-md shadow-blue-600/40"
        style={{
          width: thumbPx,
          height: thumbPx,
          left: thumbX,
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
});

export default MapProgressSlider;
