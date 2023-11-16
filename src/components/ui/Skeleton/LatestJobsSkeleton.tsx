import React from "react"

const LatestJobsSkeleton = () => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <div className="bg-white border-stone-800 p-4 rounded">
      <div>
        <div className="w-[150px] bg-lightgrey skeleton-list-item h-5" />
        <div className="w-[200px] bg-lightgrey skeleton-list-item h-5 my-2" />
      </div>
      <div className="flex flex-col">
        {items.map(item => {
          return (
            <div key={item} className="my-2 flex items-center">
              <div className="bg-lightgrey rounded-full w-9 h-9 skeleton-list-item mr-2" />
              <div>
                <div className="w-[150px] bg-lightgrey skeleton-list-item h-5 my-1" />
                <div className="w-[200px] bg-lightgrey skeleton-list-item h-5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LatestJobsSkeleton
