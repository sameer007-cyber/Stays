"use client"

import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { toggleLike } from "@/lib/api"

export interface ListingCardProps {
  id: string
  image: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  initiallyLiked?: boolean
}

export default function ListingCard({
  id,
  image,
  title,
  location,
  price,
  rating,
  reviews,
  initiallyLiked = false,
}: ListingCardProps) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [liked, setLiked] = useState(initiallyLiked)
  const [loading, setLoading] = useState(false)

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user || loading) return

    setLiked(!liked)
    setLoading(true)

    try {
      const token = await getToken()
      await toggleLike(id, token!)
    } catch {
      setLiked((v) => !v)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Link href={`/listings/${id}`} className="group">
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {user && (
          <Button
            size="icon"
            variant="ghost"
            onClick={handleLike}
            className="absolute right-3 top-3 rounded-full bg-white/90 hover:bg-white"
          >
            <Heart
              className={`h-5 w-5 ${
                liked
                  ? "fill-rose-500 text-rose-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{title}</h3>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-foreground" />
            {rating.toFixed(1)}
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{location}</p>

        <p className="pt-1 text-sm">
          <span className="font-semibold">${price}</span>{" "}
          <span className="text-muted-foreground">night</span>
        </p>
      </div>
    </Link>
  )
}
