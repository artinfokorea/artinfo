import AdSkeleton from "@/components/ui/Skeleton/AdSkeleton"
import FeedSkeleton from "@/components/ui/Skeleton/FeedSkeleton"
import LatestJobsSkeleton from "@/components/ui/Skeleton/LatestJobsSkeleton"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import React from "react"

const loading = () => {
  const count = [1, 2, 3, 4, 5]

  return (
    <div className="mx-auto max-w-screen-lg px-4 mt-2 lg:px-0 h-screen md:pt-2">
      <div className="py-2 md:p-0 mb-2  bg-lightgrey=">
        <AspectRatio
          ratio={4 / 1}
          className="rounded-xl shadow skeleton-list-item my-2"
        />
      </div>

      <div className="flex my-2">
        <div className="flex-1 overflow-hidden" id="top">
          <div className="feed-groups ">
            <div className="h-[46px]  skeleton-list-item rounded-lg mb-2" />
            {/* <div className="h-5 skeleton-list-item my-2 w-20 rounded-lg" /> */}

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
