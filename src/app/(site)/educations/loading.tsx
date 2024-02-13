import LessonSkeleton from "@/components/ui/Skeleton/LessonSkeleton"
import React from "react"

const loading = () => {
  return (
    <div className="sm:container mx-auto pt-4 px-4">
      <div className="flex justify-between mt-4">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">레슨</h2>
          <div className="flex ml-4 items-center rounded-2xl h-8 w-20 skeleton-list-item text-white  hover:bg-indigo-400" />
          <div className="flex ml-4 items-center rounded-2xl h-8 w-20 skeleton-list-item text-white  hover:bg-indigo-400" />
        </div>

        <div className="flex ml-4 items-center rounded-2xl h-8 w-24 skeleton-list-item text-white  hover:bg-indigo-400" />
      </div>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-5 px-2">
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
        <LessonSkeleton />
      </div>
    </div>
  )
}

export default loading
