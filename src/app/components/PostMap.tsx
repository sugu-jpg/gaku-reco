// src/app/components/PostMap.tsx
"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// MiniMap を SSR 無効で読み込み
const MiniMap = dynamic(() => import("./MiniMap"), {
  ssr: false,
});

export default function PostMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="mt-4 w-full h-64">
      <Suspense fallback={<p>地図読み込み中...</p>}>
        <MiniMap lat={lat} lng={lng} />
      </Suspense>
    </div>
  );
}
