"use client"

import { Star, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"

interface Review {
  id: string
  rating: number
  comment?: string
  userId: string
  user: { name: string }
}

export function ReviewsList({ reviews }: { reviews: Review[] }) {
  const { user } = useUser()
  const [items, setItems] = useState(reviews)

  const handleDelete = async (id: string) => {
    const prev = items
    setItems((r) => r.filter((x) => x.id !== id))

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      if (!res.ok) throw new Error()
    } catch {
      setItems(prev)
      alert("Failed to delete review")
    }
  }

  if (items.length === 0) {
    return <p className="text-muted-foreground">No reviews yet.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((review) => (
        <div key={review.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-foreground" />
              <span className="font-medium">{review.rating}</span>
              <span className="text-sm text-muted-foreground">
                by {review.user.name}
              </span>
            </div>

            {user?.id === review.userId && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {review.comment && (
            <p className="mt-2 text-sm">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
