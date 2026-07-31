import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Asset {
  id: string;
  name: string;
  infrastructureType: string;
  location: string;
  status: string;
  mapLink?: string;
  lat?: number | null;
  lng?: number | null;
}

interface MapOverviewModalProps {
  onClose: () => void;
}

const markerIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#fff;border:2px solid #000;box-shadow:0 0 0 4px rgba(255,255,255,0.25)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

export default function MapOverviewModal({ onClose }: MapOverviewModalProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data))
      .catch((err) => console.error("Error fetching assets:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !mapContainerRef.current || mapRef.current) return;

    const located = assets.filter(
      (a): a is Asset & { lat: number; lng: number } =>
        typeof a.lat === "number" && typeof a.lng === "number"
    );

    const map = L.map(mapContainerRef.current, {
      center: located.length > 0 ? [located[0].lat, located[0].lng] : [19.076, 72.8777],
      zoom: located.length > 0 ? 5 : 3
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
      className: "grayscale-tiles"
    }).addTo(map);

    if (located.length > 0) {
      const markers: L.Marker[] = [];
      located.forEach((asset) => {
        const marker = L.marker([asset.lat, asset.lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(
          `<div style="font-family:sans-serif"><strong>${asset.name}</strong><br/>${asset.infrastructureType}<br/>${asset.location}<br/>Status: ${asset.status}${
            asset.mapLink ? `<br/><a href="${asset.mapLink}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>` : ""
          }</div>`
        );
        markers.push(marker);
      });
      if (markers.length > 1) {
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.3));
      }
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [loading, assets]);

  const unlocatedCount = assets.filter((a) => !(typeof a.lat === "number" && typeof a.lng === "number")).length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-[1000]"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-white mb-1">Map Overview</h3>
        <p className="text-xs text-gray-500 mb-4">
          Assets pinned by their Google Maps link.
          {unlocatedCount > 0 && ` ${unlocatedCount} asset(s) have no map link yet.`}
        </p>
        <div
          ref={mapContainerRef}
          className="w-full h-[60vh] rounded-xl overflow-hidden border border-white/10"
        />
      </div>
    </div>
  );
}
