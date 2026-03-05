import { Canvas, PencilBrush } from "fabric";
import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { grahamScan } from "./gram-scan";

type Props = {
  boundsRef: React.RefObject<any>;
  sizeRef: React.RefObject<any>;
  enabled: boolean;
  onDrawingComplete: (paths: CanvasPath[]) => void;
};

export const UpdateBounds = ({
  boundsRef,
  sizeRef,
}: {
  boundsRef: React.RefObject<any>;
  sizeRef: React.RefObject<any>;
}) => {
  const map = useMap();
  const updateBounds = () => {
    if (map) {
      const b = map.getBounds();
      boundsRef.current = {
        minLat: b.getSouthWest().lat,
        maxLat: b.getNorthEast().lat,
        minLng: b.getSouthWest().lng,
        maxLng: b.getNorthEast().lng,
      };
    }
  };
  useEffect(() => {
    sizeRef.current = map.getSize();
    updateBounds();
    // updateBounds(); // Gọi lần đầu
    map.on("moveend", updateBounds); // Cập nhật khi di chuyển
    return () => {
      map.off("moveend", updateBounds);
    };
  }, [map]);

  return null;
};

export function MapDrawing({
  boundsRef,
  sizeRef,
  enabled,
  onDrawingComplete,
}: Props) {
  const canvasRef = useRef<ReactSketchCanvasRef | null>(null);
  const fabricCanvasRef = useRef(null);
  const [newMarker, setNewMarker] = useState(null);

  // const map = useMap();
  // const [polygonCoords, setPolygonCoords] = useState([]);
  // const [bounds, setBounds] = useState(null);
  // const [size, setSize] = useState<Point>(new Point(1000, 1000));
  // const [isDrawing, setIsDrawing] = useState(false);

  const mapCanvasToLatLng = (x, y) => {
    if (!boundsRef.current) return [0, 0]; // Nếu chưa có dữ liệu bounds, trả về [0,0]
    const { minLat, maxLat, minLng, maxLng } = boundsRef.current;

    const lat = maxLat - (y / sizeRef.current.y) * (maxLat - minLat);
    const lng = minLng + (x / sizeRef.current.x) * (maxLng - minLng);
    return [lat, lng];
  };
  console.log(sizeRef.current, "SIZE");

  const handleStrokeEnd = async () => {
    if (canvasRef.current) {
      const drawnPaths = await canvasRef.current.exportPaths();
      console.log(drawnPaths, "paths");
      console.log(
        "Người dùng thả chuột - Dữ liệu vẽ:",
        drawnPaths,
        sizeRef.current
      );

      // // setIsDrawing(false);
      // console.log(
      //   drawnPaths?.[0]?.paths?.length > 1,
      //   "drawnPaths[0].drawModedrawnPaths[0].drawMode"
      // );
      if (drawnPaths?.[0]?.paths?.length > 1) {
        const points = drawnPaths[0].paths.map((point) =>
          mapCanvasToLatLng(point.x, point.y)
        );
        console.log(
          drawnPaths[0].paths,
          "drawnPaths[0].pathsdrawnPaths[0].paths"
        );

        const _points = grahamScan(points);
        console.log(_points, "_points_points_points");

        // setPolygonCoords(_points);
        onDrawingComplete(_points);
        setNewMarker(null);
        canvasRef.current?.clearCanvas();
      }

      // onDrawingComplete(paths);
    }
  };

  // Lắng nghe sự kiện chuột khi vẽ xong (thả chuột)
  const handleMouseUp = async () => {
    console.log("mounse_up", enabled);

    if (enabled) {
      // setIsDrawing(false);
      const drawnPaths = (await canvasRef.current?.exportPaths()) || [];
      console.log(
        "Người dùng thả chuột - Dữ liệu vẽ:",
        drawnPaths,
        sizeRef.current
      );

      if (drawnPaths.length > 0) {
        // Lấy danh sách các điểm từ đường vẽ đầu tiên
        const points = drawnPaths[0].paths.map((point) =>
          mapCanvasToLatLng(point.x, point.y)
        );
        const _points = grahamScan(points);
        // setPolygonCoords(_points);
        onDrawingComplete(_points);
        setNewMarker(null);
      }
      // setIsDrawing(false);

      // setPaths(drawnPaths);
    }
  };

  useEffect(() => {
    // Khởi tạo Fabric.js trên canvas
    const fabricCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: false, // Tắt chế độ vẽ ban đầu
      backgroundColor: "transparent", // Nền trong suốt
    });
    fabricCanvasRef.current = fabricCanvas;

    // Cấu hình nét vẽ
    if (!fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
    }

    fabricCanvas.freeDrawingBrush.width = 3;
    fabricCanvas.freeDrawingBrush.color = "red";
    // fabricCanvas.freeDrawingBrush.width = 3;
    // fabricCanvas.freeDrawingBrush.color = "red";

    // const handleMouseUp = async () => {
    //   if (isDrawing) {
    //     setIsDrawing(false);
    //     const drawnPaths = await canvasRef.current.exportPaths();
    //     console.log("Người dùng thả chuột - Dữ liệu vẽ:", drawnPaths);
    //     // setPaths(drawnPaths);
    //   }
    // };

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.isDrawingMode =
          !fabricCanvasRef.current.isDrawingMode;
      }
      if (fabricCanvasRef.current.isDrawingMode) {
        canvasRef.current.clearCanvas();
      }
    }
  }, [enabled]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 500, // cao hơn leaflet tiles & controls
        pointerEvents: enabled ? "auto" : "none",
      }}
    >
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={4}
        strokeColor="#ff0000"
        canvasColor="transparent"
        style={{
          width: "100%",
          height: "100%",
        }}
        onStroke={handleStrokeEnd}
      />
    </div>
  );
}
