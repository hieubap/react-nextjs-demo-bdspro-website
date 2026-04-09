import React, { useState, forwardRef, useImperativeHandle } from "react";
import { CloseSVG } from "../Images/SVG";
import IOSSwitch from "@/components/ios-switch";
import Image from "next/image";
import styled from "styled-components";

interface MapItem {
  id: string;
  label: string;
  imgSrc: string;
}

const baseMaps: MapItem[] = [
  {
    id: "street",
    label: "Đường phố",
    imgSrc: require("../Images/PNG/layer-street.png"),
  },
  {
    id: "satellite",
    label: "Vệ tinh",
    imgSrc: require("../Images/PNG/layer-ve-tinh.png"),
  },
];

const planningLayers: MapItem[] = [
  {
    id: "ranhthua_tq_line",
    label: "Ranh thửa",
    imgSrc: require("../Images/PNG/layer-ranh-thua.png"),
  },
  {
    id: "qh_sdd_raster",
    label: "Quy hoạch",
    imgSrc: require("../Images/PNG/layer-quy-hoach.png"),
  },
  {
    id: "dtvt_polygon",
    label: "Đầu tư",
    imgSrc: require("../Images/PNG/layer-street.png"),
  },
];

export interface MapTooltipHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const PickLayerModal = forwardRef<
  MapTooltipHandle,
  {
    onClose: () => void;
    onSelectBaseMap: (id: string) => void;
    onSelectLayer: (id: string) => void;
    onShowPlanningLayer: (show: boolean) => void;
  }
>(
  (
    {
      onClose,
      onSelectBaseMap,
      onSelectLayer,
      onShowPlanningLayer,
    }: {
      onClose: () => void;
      onSelectBaseMap: (id: string) => void;
      onSelectLayer: (id: string) => void;
      onShowPlanningLayer: (show: boolean) => void;
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBaseMap, setSelectedBaseMap] = useState<string | null>(
      "street"
    );
    const [selectedLayer, _setSelectedLayer] = useState<string | null>(null);
    const setSelectedLayer = (id: string) => {
      _setSelectedLayer(id);
      onSelectLayer(id);
    };
    const [showPlanningLayer, setShowPlanningLayer] = useState(false);
    // expose methods cho parent
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
    }));

    const renderList = (
      items: MapItem[],
      selectedId: string | null,
      onSelect: (id: string) => void
    ) => (
      <div className="flex gap-3">
        {items.map((item) => (
          <div key={item.id} onClick={() => onSelect(item.id)}>
            <div
              className={`cursor-pointer border-2 p-1 rounded-md transition-all ${
                selectedId === item.id
                  ? "layer-pick-item_active"
                  : "layer-pick-item"
              }`}
            >
              <Image
                src={item.imgSrc}
                alt={item.label}
                className="layer-pick_img w-20 h-20 object-cover rounded"
              />
            </div>
            <p className="text-center mt-1 text-sm">{item.label}</p>
          </div>
        ))}
      </div>
    );

    console.log("isOpen", isOpen);

    return (
      <WrapStyled>
        <div
          className={`
        modal-bottom-container
        transform transition-all duration-300 ease-out
        ${isOpen ? "translate-y-0 bottom-0" : "translate-y-full"}
      `}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold mb-2">Loại bản đồ</h3>
            <CloseSVG
              onClick={() => setIsOpen(false)}
              width={24}
              height={24}
              className="w-6 h-6 pointer"
            />
          </div>
          <div className="mb-4">
            <p className="text-gray-600 mb-1">Bản đồ nền:</p>
            {renderList(baseMaps, selectedBaseMap, setSelectedBaseMap)}
          </div>

          <div>
            <p className="text-gray-600 mb-1">Lớp quy hoạch:</p>
            {renderList(planningLayers, selectedLayer, setSelectedLayer)}
          </div>

          <div className="flex justify-between items-center py-2">
            <div className="text-gray-600 mb-1">Hiển thị lớp quy hoạch</div>
            <IOSSwitch
              checked={showPlanningLayer}
              onChange={(checked) => {
                setShowPlanningLayer(checked);
                onShowPlanningLayer(checked);
              }}
            />
          </div>
        </div>
      </WrapStyled>
    );
  }
);

PickLayerModal.displayName = "PickLayerModal";

export default PickLayerModal;

const WrapStyled = styled.div`
  .layer-pick-item_active {
    border: 2px solid #007aff;
    border-radius: 12px;
  }
  .layer-pick-item {
    border: 2px solid #e0e0e0;
    border-radius: 12px;
  }
  .layer-pick_img {
    border-radius: 8px;
  }
`;
