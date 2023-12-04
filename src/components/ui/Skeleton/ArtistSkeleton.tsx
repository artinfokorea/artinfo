import React from "react"

const ArtistSkeleton = () => {
  return (
    <div className="card flex flex-col bg-white rounded-2xl cursor-pointer shadow-md">
      <div className="relative h-[90px] md:h-[180px] skeleton-list-item  rounded-t-2xl" />
      <div className="py-2 flex flex-col items-center break-keep h-16" />
    </div>
  )
}

export default ArtistSkeleton
