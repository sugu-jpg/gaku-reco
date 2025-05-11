"use client";

import dynamic from 'next/dynamic';

// MapDisplayをSSRなしで動的にインポート
const MapDisplay = dynamic(() => import('./MapDisplay'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center">地図を読み込み中...</div>
});

interface MapWrapperProps {
  lat: number;
  lng: number;
}

export default function MapWrapper({ lat, lng }: MapWrapperProps) {
  return <MapDisplay lat={lat} lng={lng} />;
}
