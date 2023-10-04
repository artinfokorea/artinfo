"use client"

import PositionTag from "@/components/Common/PositionTag"
import useFilters from "@/hooks/useFilters"
import { Job, RECRUIT_JOBS_CATEGORY_ITEMS } from "@/types/types"
import { Spinner } from "@material-tailwind/react"
import Image from "next/image"
import { useState } from "react"

interface IProps {
  job: Job
}

export default function JobCard({ job }: IProps) {
  const filters = useFilters()
  const [isLoading, setIsLoading] = useState(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="card">
      <div className="overflow-hidden relative h-[150px]">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {job.company_image_url && (
          <Image
            src={job.company_image_url ?? "/icon-192x192.png"}
            alt="job"
            sizes="(max-width: 1200px) 276px, 150px"
            fill
            priority
            className="rounded-md"
            onLoad={handleImageLoad}
          />
        )}
      </div>
      <div className="py-2">
        <div className="flex flex-col mb-1">
          <div className="text-sm  text-darkgrey truncate flex-1 flex items-center my-1 lg:my-2 ">
            <span className="mr-2">
              <PositionTag tag={RECRUIT_JOBS_CATEGORY_ITEMS[job.category]} />
            </span>
            <span>{job.company_name} </span>
          </div>
          <div className="text-sm font-semibold my-0 line-clamp-3 break-keep lg:text-base sm:my-0 md:my-1 lg:my-2">
            {job.title}
          </div>
          <span className="text-darkgrey opacity-75">
            {filters.DIFF_FROM_NOW_ADD_TIME(job.created_at)}
          </span>
        </div>
      </div>
    </div>
  )
}
