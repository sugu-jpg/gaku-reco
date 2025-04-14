"use client"

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet"
import { useEffect } from "react"
import type { LeafletMouseEvent } from "leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
})

type Props = {
  setLat: (lat: number) => void
  setLng: (lng: number) => void
  lat?: number | null
  lng?: number | null
}

export default function MapPicker({ setLat, setLng, lat, lng }: Props) {
  const position = lat && lng ? { lat, lng } : null

  function LocationMarker() {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        setLat(e.latlng.lat)
        setLng(e.latlng.lng)
      },
    })
    return position ? <Marker position={position} /> : null
  }

  function FlyToLocation() {
    const map = useMap()
    useEffect(() => {
      if (lat && lng) {
        map.flyTo([lat, lng], 16)
      }
    }, [lat, lng])
    return null
  }

  return (
    <MapContainer
      center={position || { lat: 35.5614, lng: 139.3976 }}
      zoom={14}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToLocation />
      <LocationMarker />
    </MapContainer>
  )
}
