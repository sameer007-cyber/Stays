const API_URL = process.env.NEXT_PUBLIC_API_URL!


export async function getListings(filters?: {
  location?: string | null
  minPrice?: string | null
  maxPrice?: string | null
}) {
  const params = new URLSearchParams()

  if (filters?.location) params.append("location", filters.location)
  if (filters?.minPrice) params.append("minPrice", filters.minPrice)
  if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice)

  const res = await fetch(`${API_URL}/listings?${params.toString()}`)

  if (!res.ok) throw new Error("Fetch failed")
  return res.json()
}

export async function getListingById(id: string, token?: string) {
  const res = await fetch(`${API_URL}/listings/${id}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  })

  if (!res.ok) return null
  return res.json()
}


export async function getReviewsByListingId(id: string) {
  const res = await fetch(`${API_URL}/reviews/listing/${id}`)

  if (!res.ok) throw new Error("Reviews failed")
  return res.json()
}

export async function createReview(
  data: {
    rating: number
    comment?: string
    listingId: string
  },
  token: string
) {
  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Review failed")
  return res.json()
}

export async function deleteReview(id: string, token: string) {
  const res = await fetch(`${API_URL}/reviews/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Delete failed")
}


export async function toggleLike(listingId: string, token: string) {
  const res = await fetch(`${API_URL}/likes/${listingId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Like failed")
  return res.json()
}

export async function getMyLikes(token: string) {
  const res = await fetch(`${API_URL}/likes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Likes fetch failed")
  return res.json()
}