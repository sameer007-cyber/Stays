import { Skeleton } from "@/components/ui/skeleton"

export function ListingCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  )
}
