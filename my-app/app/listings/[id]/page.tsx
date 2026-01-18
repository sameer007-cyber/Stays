"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import {
  getListingById,
  getReviewsByListingId,
} from "@/lib/api"
import { ReviewsList } from "@/components/reviews-list"
import { ReviewForm } from "@/components/review-form"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function ListingPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { getToken } = useAuth()

  const [listing, setListing] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!id) return

    async function load() {
      try {
        const token = await getToken()
        const listingData = await getListingById(id, token!)
        const reviewData = await getReviewsByListingId(id)

        setListing(listingData)
        setReviews(reviewData)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, getToken])

  if (loading) {
    return <p className="p-10">Loading…</p>
  }

  if (!listing) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    )
  }

  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  /* ---------------- DELETE ---------------- */
  async function handleDelete() {
    if (!confirm("Delete this listing?")) return

    const token = await getToken()

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/listings/${listing.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    router.push("/")
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      {/* HERO IMAGE */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
        <img
          src={listing.imageUrl || "/placeholder.svg"}
          alt={listing.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* HEADER + OWNER ACTIONS */}
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold">{listing.title}</h1>
          <p className="text-muted-foreground">{listing.location}</p>

          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-foreground" />
            {avgRating.toFixed(1)} ({reviews.length} reviews)
          </div>
        </div>

        {/* ✅ EDIT / DELETE (OWNER ONLY) */}
        {listing.isOwner && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/listings/${listing.id}/edit`)
              }
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* PRICE */}
      <p className="text-2xl font-semibold">
        ${listing.price}{" "}
        <span className="text-base font-normal">/ night</span>
      </p>

      {/* REVIEWS */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Reviews</h2>

        <ReviewsList reviews={reviews} />

        {/* OWNER CANNOT REVIEW OWN LISTING */}
        {!listing.isOwner && (
          <ReviewForm listingId={listing.id} />
        )}
      </section>
    </main>
  )
}
