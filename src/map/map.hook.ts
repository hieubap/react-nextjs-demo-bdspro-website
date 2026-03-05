import { useEffect } from "react";
import L from "leaflet";

export function useLeafletPlugins(map: L.Map) {
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!mounted) return;

      // fix marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      // plugins
      const proj4 = (await import("proj4")).default;
      if (typeof window !== "undefined") {
        (window as any).proj4 = proj4;
      }

      // await import("proj4leaflet");
      await import("leaflet-control-geocoder");
      await import("leaflet-side-by-side");
      await import("leaflet-easybutton");
      await import("leaflet.locatecontrol");
      await import("leaflet-sidebar-v2");
      await import("leaflet.locatecontrol/dist/L.Control.Locate.min.js");
      await import("leaflet/dist/leaflet.css");
      await import("leaflet-control-geocoder/dist/Control.Geocoder.css");
      await import("leaflet.locatecontrol/dist/L.Control.Locate.min.css");
      await import("leaflet-easybutton/src/easy-button.css");
      await import("leaflet-sidebar-v2/css/leaflet-sidebar.min.css");

      // Easy button
      (L as any)
        .easyButton("fa-solid fa-crosshairs", () => {
          map.setView([21.13867331965655, 105.50512215640994], 16);
        })
        .addTo(map);

      // Geocoder
      (L.Control as any)
        .geocoder({ defaultMarkGeocode: false })
        .on("markgeocode", (e: any) => {
          const g = e.geocode;
          L.marker(g.center)
            .addTo(map)
            .bindPopup(`<strong>${g.name}</strong><br/>${g.html}`)
            .openPopup();
          map.setView(g.center, 16);
        })
        .addTo(map);

      // Locate
      (L.control as any)
        .locate({
          position: "topleft",
          flyTo: true,
          locateOptions: { enableHighAccuracy: true },
        })
        .addTo(map);
    })();

    return () => {
      mounted = false;
    };
  }, [map]);
}
