"use client"

import Map, { Marker } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { formatPrice } from "@/lib/currency"

export type MapListing = {
  id: string
  latitude: number
  longitude: number
  price: number
}

interface Props {
  listings: MapListing[]
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  selectedId: string | null
  setSelectedId: (id: string) => void
}

export default function ListingsMap({
  listings,
  hoveredId,
  setHoveredId,
  selectedId,
  setSelectedId,
}: Props) {
  const avgLat =
    listings.reduce((s, l) => s + l.latitude, 0) /
    listings.length

  const avgLng =
    listings.reduce((s, l) => s + l.longitude, 0) /
    listings.length

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          latitude: avgLat,
          longitude: avgLng,
          zoom: 5,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {listings.map((l) => {
          const active =
            hoveredId === l.id || selectedId === l.id

          return (
            <Marker
              key={l.id}
              latitude={l.latitude}
              longitude={l.longitude}
              anchor="bottom"
            >
              <div
                onMouseEnter={() => setHoveredId(l.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(l.id)}
                className={`cursor-pointer rounded-full px-3 py-1 text-sm font-semibold shadow transition
                  ${
                    active
                      ? "bg-rose-500 text-white scale-110"
                      : "bg-white text-black"
                  }`}
              >
                {formatPrice(l.price, "USD")}
              </div>
            </Marker>
          )
        })}
      </Map>
    </div>
  )
}
