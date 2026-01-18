"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ListingCard from "@/components/listing-card"
import ListingsMap from "@/components/listings-map"
import { getListings } from "@/lib/api"

interface Listing {
  id: string
  title: string
  location: string | null
  price: number
  imageUrl: string | null
  latitude?: number | null
  longitude?: number | null
  reviews: { rating: number }[]
}

export default function ListingsGrid() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)

    getListings({
      location: searchParams.get("location"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
    })
      .then(setListings)
      .finally(() => setLoading(false))
  }, [searchParams])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-muted-foreground">
        Loading stays…
      </div>
    )
  }

  const listingsWithCoords = listings.filter(
    (l): l is Listing & { latitude: number; longitude: number } =>
      typeof l.latitude === "number" &&
      typeof l.longitude === "number"
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 space-y-10">
      {/* 🗺 MAP */}
      {listingsWithCoords.length > 0 && (
        <ListingsMap
          listings={listingsWithCoords.map((l) => ({
            id: l.id,
            latitude: l.latitude,
            longitude: l.longitude,
            price: l.price,
          }))}
          hoveredId={hoveredId}
          selectedId={selectedId}
          setHoveredId={setHoveredId}
          setSelectedId={setSelectedId}
        />
      )}

      {/* 🏠 GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((l) => {
          const count = l.reviews.length
          const avg =
            count === 0
              ? 0
              : l.reviews.reduce((s, r) => s + r.rating, 0) / count

          return (
            <div
              key={l.id}
              onMouseEnter={() => setHoveredId(l.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedId(l.id)}
            >
              <ListingCard
                id={l.id}
                image={l.imageUrl ?? "/placeholder.svg"}
                title={l.title}
                location={l.location ?? "Unknown"}
                price={l.price}
                rating={avg}
                reviews={count}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
