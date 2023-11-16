import React from "react"

const ConcertSkeleton = () => {
  return (
    <div className="card flex flex-col bg-zinc-900 border border-stone-800 rounded-md ">
      <div
        className="overflow-hidden relative  rounded-t-md skeleton-list-item"
        style={{ maxHeight: 300 }}
      >
        <div className="w-full h-[300px]  skeleton-list-item" />
      </div>
      <div className="px-4 py-2 flex flex-col flex-1">
        <div className="flex-1">
          <div className="mt-2 mb-1 text-sm font-semibold " />
        </div>
        <div className="text-sm" />
      </div>
    </div>
  )
}

export default ConcertSkeleton
