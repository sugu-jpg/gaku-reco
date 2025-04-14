// src/components/MiniMap.tsx
"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type MiniMapProps = {
  lat: number;
  lng: number;
};

export default function MiniMap({ lat, lng }: MiniMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "150px", width: "100%" }}
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
