"use client"

import { useState } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { createReview } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function ReviewForm({ listingId }: { listingId: string }) {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  if (!user) return null

  const submit = async () => {
    try {
      setLoading(true)
      const token = await getToken()

      const review = await createReview(
        { rating, comment, listingId },
        token!
      )

      setComment("")
      setRating(5)

      window.dispatchEvent(
        new CustomEvent("review-added", { detail: review })
      )
    } catch {
      alert("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="border rounded p-2"
      >
        {[5,4,3,2,1].map(n => (
          <option key={n} value={n}>{n} stars</option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a review"
        className="border rounded p-2 w-full"
      />

      <Button onClick={submit} disabled={loading}>
        {loading ? "Posting..." : "Post review"}
      </Button>
    </div>
  )
}