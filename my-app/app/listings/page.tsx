import { Suspense } from "react"
import ListingsGrid from "@/components/listing-grid"

export const metadata = {
  title: "Browse Stays - Find Accommodations Worldwide",
  description: "Explore thousands of unique places to stay around the world",
}

export default function ListingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-4xl font-bold">Browse Stays</h1>
        <p className="mt-2 text-muted-foreground">
          Discover accommodations that match your preferences
        </p>
      </div>

      {/* ✅ REQUIRED for useSearchParams */}
      <Suspense
        fallback={
          <div className="px-4 py-12 text-muted-foreground">
            Loading stays…
          </div>
        }
      >
        <ListingsGrid />
      </Suspense>
    </main>
  )
}
