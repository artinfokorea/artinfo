import AdSkeleton from "@/components/ui/Skeleton/AdSkeleton"
import FeedSkeleton from "@/components/ui/Skeleton/FeedSkeleton"
import LatestJobsSkeleton from "@/components/ui/Skeleton/LatestJobsSkeleton"
import VisitorSkeleton from "@/components/ui/Skeleton/VisitorSkeleton"
import React from "react"

const loading = () => {
  const count = [1, 2, 3, 4, 5]

  return (
    <div className="mx-auto max-w-screen-lg lg:px-0 h-screen pt-0 md:pt-2">
      <div className="py-2 px-4 md:p-0 mb-2 h-[140px] md:h-[250px] bg-lightgrey rounded-xl shadow skeleton-list-item" />
      <div className="flex my-2">
        <div className="flex-1 overflow-hidden" id="top">
          {/* <VisitorSkeleton /> */}
          <div className="feed-groups m-5">
            <div className="h-5 skeleton-list-item my-2 w-20 rounded-lg" />

            <div className="flex">
              {count.map(item => {
                return <AdSkeleton key={item} />
              })}
            </div>
            {count.map(item => {
              return <FeedSkeleton key={item} />
            })}
          </div>
        </div>
        <div className="ml-5 hidden md:block " style={{ width: 300 }}>
          <LatestJobsSkeleton />
        </div>
      </div>
    </div>
  )
}

export default loading
