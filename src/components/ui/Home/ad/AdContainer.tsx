"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAds } from "@/app/Api"
import AdSkeleton from "@/components/ui/Skeleton/AdSkeleton"
import AdUi from "./AdUi"

export default function AdContainer() {
  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    suspense: false,
    queryFn: () => fetchAds(),
  })

  return (
    <div>
      {!isLoading && ads?.data ? (
        <AdUi posters={ads.data} />
      ) : (
        <div className="flex">
          <AdSkeleton />
          <AdSkeleton />
          <AdSkeleton />
        </div>
      )}
    </div>
  )
}
