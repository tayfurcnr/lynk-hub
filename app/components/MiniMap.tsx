"use client";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];

const DRONE_POSITION: [number, number] = [37.7766, -122.418];

const markerIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).toString(),
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

const droneIcon = L.divIcon({
  className: "drone-marker",
  html: `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="8" />
      <path d="M12 20h10l10 12-10 12H12z" />
      <path d="M52 20H42L32 32l10 12h10z" />
      <circle cx="10" cy="20" r="6" />
      <circle cx="54" cy="20" r="6" />
      <circle cx="10" cy="44" r="6" />
      <circle cx="54" cy="44" r="6" />
    </svg>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export default function MiniMap() {
  const [tilt, setTilt] = useState(12);
  const [scale, setScale] = useState(1.02);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.options.iconUrl,
      iconRetinaUrl: markerIcon.options.iconRetinaUrl,
      shadowUrl: markerIcon.options.shadowUrl,
    });

    mapRef.current = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    }).addTo(mapRef.current);

    overlayRef.current = L.layerGroup().addTo(mapRef.current);

    L.marker(DRONE_POSITION, { icon: droneIcon }).addTo(overlayRef.current!);

    setMapReady(true);

    return () => {
      overlayRef.current?.clearLayers();
      overlayRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      className="map-surface"
      style={
        {
          "--map-tilt": `${tilt}deg`,
          "--map-scale": scale,
        } as CSSProperties
      }
    >
      <div className="leaflet-container" ref={containerRef} />
      {!mapReady && <div className="map-fallback">Loading map…</div>}

      <div className="map-controls">
        <label>
          Tilt
          <input
            type="range"
            min="6"
            max="18"
            step="1"
            value={tilt}
            onChange={(event) => setTilt(Number(event.target.value))}
          />
        </label>
        <label>
          Depth
          <input
            type="range"
            min="0.98"
            max="1.06"
            step="0.01"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            setTilt(12);
            setScale(1.02);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
