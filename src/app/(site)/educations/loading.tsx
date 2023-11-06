import React from "react"
import LessonSkeleton from "@/components/ui/Skeleton/LessonSkeleton"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"

const Loading = () => {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <div className="flex justify-between mt-4 px-2">
        <h2 className="text-2xl font-bold mb-4">레슨</h2>
        <ChipButton url="/educations/create" title="레슨등록" />
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

export default Loading
