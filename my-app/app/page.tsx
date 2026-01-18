import { Suspense } from "react"
import { SearchSection } from "@/components/search-section"
import ListingsGrid from "@/components/listing-grid"

export const metadata = {
  title: "Stays - Find Your Perfect Accommodation",
  description: "Discover unique places to stay around the world",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <SearchSection />

      {/* ✅ REQUIRED for useSearchParams */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 text-muted-foreground">
            Loading stays…
          </div>
        }
      >
        <ListingsGrid />
      </Suspense>
    </main>
  )
}
