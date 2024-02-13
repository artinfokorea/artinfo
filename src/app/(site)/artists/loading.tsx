import ArtistSkeleton from "@/components/ui/Skeleton/ArtistSkeleton"
import React from "react"

const loading = () => {
  return (
    <div className="max-w-screen-lg mx-auto pt-8 px-4">
      <div className="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-2">
        <ArtistSkeleton />
        <ArtistSkeleton />
        <ArtistSkeleton />
        <ArtistSkeleton />
        <ArtistSkeleton />
        <ArtistSkeleton />
      </div>
    </div>
  )
}

export default loading
