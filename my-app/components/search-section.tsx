"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SearchSection() {
  const router = useRouter()

  const [location, setLocation] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  function submit() {
    const params = new URLSearchParams()

    if (location) params.set("location", location)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)

    router.push(`/?${params.toString()}`)
  }

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col gap-4 rounded-full border border-gray-200 bg-white p-3 shadow-md md:flex-row md:items-center">
          <div className="flex items-center gap-2 flex-1 px-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>

          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />

          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />

          <Button
            onClick={submit}
            className="rounded-full bg-rose-500 hover:bg-rose-600 gap-2 px-6"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </section>
  )
}
