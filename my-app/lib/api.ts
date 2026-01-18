const API_URL = process.env.NEXT_PUBLIC_API_URL!

/* ---------------- LISTINGS ---------------- */

export async function getListings(filters?: {
  location?: string | null
  minPrice?: string | null
  maxPrice?: string | null
}) {
  const params = new URLSearchParams()

  if (filters?.location) params.append("location", filters.location)
  if (filters?.minPrice) params.append("minPrice", filters.minPrice)
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice)

  const res = await fetch(`${API_URL}/listings?${params.toString()}`, {
    credentials: "include",
  })

  if (!res.ok) throw new Error("Fetch failed")
  return res.json()
}

/**
 * GET single listing
 * Cookie auth is automatic
 */
export async function getListingById(id: string) {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    credentials: "include",
  })

  if (!res.ok) return null
  return res.json()
}

/* ---------------- REVIEWS ---------------- */

export async function getReviewsByListingId(id: string) {
  const res = await fetch(`${API_URL}/reviews/listing/${id}`, {
    credentials: "include",
  })

  if (!res.ok) throw new Error("Reviews failed")
  return res.json()
}

export async function createReview(data: {
  rating: number
  comment?: string
  listingId: string
}) {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error("Review failed:", text)
    throw new Error("Review failed")
  }

  return res.json()
}

/* ---------------- LIKES ---------------- */

export async function toggleLike(listingId: string) {
  const res = await fetch(`${API_URL}/likes/${listingId}`, {
    method: "POST",
    credentials: "include",
  })

  if (!res.ok) throw new Error("Like failed")
  return res.json()
}

export async function getMyLikes() {
  const res = await fetch(`${API_URL}/likes`, {
    credentials: "include",
  })

  if (!res.ok) throw new Error("Likes fetch failed")
  return res.json()
}
