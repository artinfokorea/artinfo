import React from "react"

const JobSkeleton = () => {
  return (
    <div className="card bg-white border border-stone-800 rounded">
      <div className="overflow-hidden relative" style={{ height: "150px" }}>
        <div className="w-full h-[150px] bg-whitesmoke" />
      </div>
      <div className="p-4">
        <div className="flex items-center mb-1">
          {/* <div
              style={{ width: 28, height: 28 }}
              className="rounded-md bg-gray-300 mr-2 overflow-hidden relative"
            >
              {job.organizations?.logo_image && (
                <Image
                  src={job.organizations?.logo_image}
                  alt="아트인포"
                  fill
                  sizes="40px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div> */}
          {/* <div className="text-sm truncate flex-1">
              {(JOB_POSITION_1DEPTH_CATEGORY_ITEMS as any)[job.category]}
            </div> */}
          <div className="text-sm truncate flex-1" />
        </div>
        <div className="text-base font-semibold mt-4 line-clamp-3" />

        <div className="mt-3">
          <div className="border border-lightgrey px-4 py-2 w-full rounded text-indigo-600 text-sm h-8" />
        </div>
      </div>
    </div>
  )
}

export default JobSkeleton
