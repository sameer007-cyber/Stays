"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createReview } from "@/lib/api"
import { useUser } from "@clerk/nextjs"

export function ReviewForm({ listingId }: { listingId: string }) {
  const { user } = useUser()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  if (!user) return null
const submit = async () => {
  try {
    setLoading(true)

    const newReview = await createReview({
      rating,
      comment,
      listingId,
    })

    // 🔥 optimistic insert
    setComment("")
    setRating(5)

    window.dispatchEvent(
      new CustomEvent("review-added", { detail: newReview })
    )
  } catch {
    alert("Failed to submit review")
  } finally {
    setLoading(false)
  }
}
}