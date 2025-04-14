"use client"

import { useState } from "react"

type Props = {
  setLat: (lat: number) => void
  setLng: (lng: number) => void
}

export default function MapSearchInput({ setLat, setLng }: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    if (!query) return

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`
    )
    const data = await res.json()
    setResults(data)
  }

  const handleSelect = (place: any) => {
    setLat(parseFloat(place.lat))
    setLng(parseFloat(place.lon))
    setResults([])
    setQuery(place.display_name)
  }

  return (
    <div className="mb-4">
      <label className="block mb-1 font-semibold">🔍 店名で検索</label>
      <div className="flex gap-2">
        <input
          className="border p-2 w-full rounded"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="例: サイゼリヤ 淵野辺"
        />
        <button type="button" onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          検索
        </button>
      </div>

      {results.length > 0 && (
        <ul className="mt-2 border rounded bg-white shadow">
          {results.map((place, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(place)}
              className="px-3 py-2 border-b hover:bg-gray-100 cursor-pointer text-sm"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
