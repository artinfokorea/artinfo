import React from "react"

const LessonSkeleton = () => {
  return (
    <div className="card rounded-md cursor-pointer ">
      <div
        className="overflow-hidden relative bg-whitesmoke rounded-t-md"
        style={{ maxHeight: 240 }}
      >
        <div className="w-full h-[240px] bg-lightgrey animate-pulse" />
      </div>

      <div className="w-24 bg-lightgrey h-6 my-2 opacity-70" />
    </div>
  )
}

export default LessonSkeleton
