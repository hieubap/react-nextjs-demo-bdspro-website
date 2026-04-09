import { useEffect } from "react";
import L from "leaflet";

export function useMapData(map: L.Map | null) {
  useEffect(() => {
    if (!map) return;

    const layers: L.Layer[] = [];

    const loadData = async () => {
      // Import dautu.js data (point data)
      const { uutien1Data, uutien2Data, nhadautuData } = await import(
        "../../public/data/dautu.js"
      );

      [...(uutien1Data || []), ...(uutien2Data || []), ...(nhadautuData || [])].forEach(
        (dataItem: any) => {
          const [lat, lng, code, description, area, price] = dataItem;
          const marker = L.marker([lat, lng]).bindPopup(`
            <strong>${code}</strong><br/>
            ${description}<br/>
            Diện tích: ${area}<br/>
            Giá: ${price}
          `);
          layers.push(marker);
          marker.addTo(map);
        }
      );

      // Import GeoJSON data
      const { dtvtData } = await import("../../public/data/dtvt.js");
      const { huyenData } = await import("../../public/data/huyen.js");
      const { tinhData } = await import("../../public/data/tinhVN.js");

      const geoJsonLayers = [dtvtData, huyenData, tinhData];

      geoJsonLayers.forEach((geoJsonData) => {
        if (geoJsonData && geoJsonData.features) {
          const geoLayer = L.geoJSON(geoJsonData as any, {
            style: () => ({
              color: "blue",
              weight: 2,
              opacity: 0.65,
              fillColor: "lightblue",
              fillOpacity: 0.4,
            }),
            onEachFeature: (feature, layer) => {
              if (feature.properties) {
                let popupContent = "";
                for (const key in feature.properties) {
                  if (Object.prototype.hasOwnProperty.call(feature.properties, key)) {
                    popupContent += `<strong>${key}:</strong> ${feature.properties[key]}<br/>`;
                  }
                }
                layer.bindPopup(popupContent);
              }
            },
          }).addTo(map);
          layers.push(geoLayer);
        }
      });
    };

    // loadData();

    return () => {
      // Clean up layers when component unmounts or map changes
      layers.forEach((layer) => {
        map.removeLayer(layer);
      });
    };
  }, [map]);
}
