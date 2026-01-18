"use client"

import { useEffect, useState } from "react"
import ListingCard from "@/components/listing-card"
import { useUser } from "@clerk/nextjs"

interface Listing {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  reviews: { rating: number }[]
}

export default function LikesPage() {
  const { user, isLoaded } = useUser()
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    if (!user) return

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/likes`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setListings)
      .catch(console.error)
  }, [user])

  if (!isLoaded) return null

  if (!user) {
    return (
      <div className="p-10 text-center">
        <p>Please sign in to view liked listings.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Wishlist</h1>

      {listings.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t liked any listings yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {listings.map((listing) => {
            const count = listing.reviews.length
            const avg =
              count === 0
                ? 0
                : listing.reviews.reduce(
                    (s, r) => s + r.rating,
                    0
                  ) / count

            return (
              <ListingCard
                key={listing.id}
                id={listing.id}
                image={listing.imageUrl}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                rating={avg}
                reviews={count}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
