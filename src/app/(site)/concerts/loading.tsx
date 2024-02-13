import ConcertSkeleton from "@/components/ui/Skeleton/ConcertSkeleton"
import { Badge } from "@/components/ui/badge"
import React from "react"

const loading = () => {
  return (
    <div className="sm:container mx-auto pt-4 px-4 ">
      <div className="flex justify-between mt-4">
        <h2 className="text-2xl font-bold mb-4">공연</h2>
        <button
          className="flex ml-4 items-center rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5 mr-1"
          >
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
          </svg>
          <span>공연등록</span>
        </button>
      </div>
      <div className="mb-4 skeleton-list-item h-12 rounded-2xl " />
      <div className="my-4">
        <Badge className="cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 w-24 h-10" />
        <Badge className="cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 w-24 h-10" />
        <Badge className="cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 w-24 h-10" />
        <Badge className="cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 w-24 h-10" />
        <Badge className="cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 w-24 h-10" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
        <ConcertSkeleton />
      </div>
    </div>
  )
}

export default loading
