"use client";

import MapGLView from "@/modules/quyhoach/MapGLView";
import React from "react";

const rootStyle = {
  width: "100%",
  height: "100dvh",
  position: "relative",
};

const MapPage: React.FC = () => {
  return (
    <div style={rootStyle as React.CSSProperties}>
      {/* Map Container */}
      <MapGLView />
    </div>
  );
};

export default MapPage;
