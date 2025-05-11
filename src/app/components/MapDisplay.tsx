"use client";

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapDisplayProps {
  lat: number;
  lng: number;
}

export default function MapDisplay({ lat, lng }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;

    // Leafletの初期化
    let map: L.Map;
    
    // アイコンの設定
    const defaultIcon = L.icon({
      iconUrl: '/marker-icon.png',
      iconRetinaUrl: '/marker-icon-2x.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    L.Marker.prototype.options.icon = defaultIcon;
    
    // 地図の初期化
    map = L.map(mapRef.current).setView([lat, lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // マーカーを追加
    L.marker([lat, lng]).addTo(map);
    
    // コンポーネントのアンマウント時にマップをクリーンアップ
    return () => {
      map.remove();
    };
  }, [lat, lng]);
  
  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
}
