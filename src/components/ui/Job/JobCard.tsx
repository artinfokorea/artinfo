"use client"

import PositionTag from "@/components/common/PositionTag"
import useFilters from "@/hooks/useFilters"
import { v4 as uuidv4 } from "uuid"
import { Job } from "@/types/types"
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
      <div className="overflow-hidden relative h-[120px] md:h-[150px]">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {job.companyImageUrl && (
          <Image
            src={job.companyImageUrl ?? "/job-default.png"}
            alt="job"
            sizes="(max-width: 1200px) 276px, 150px"
            fill
            quality={100}
            priority
            className="rounded-md"
            onLoad={handleImageLoad}
          />
        )}
      </div>
      <div className="">
        <div className="flex flex-col mb-1">
          <div className="text-sm  text-darkgrey truncate flex-1 flex flex-col mt-1 lg:my-2  ">
            <ul className="flex mb-1 ">
              {job.majors.map(major => (
                <PositionTag key={uuidv4()} tag={major} margin={1} />
              ))}
            </ul>

            <span className="my-1">{job.companyName} </span>
          </div>
          <div className="text-sm font-semibold my-0 line-clamp-3 break-keep lg:text-base sm:my-0 md:my-1 lg:my-2">
            {job.title}
          </div>
          <span className="text-darkgrey opacity-75">
            {filters.DIFF_FROM_NOW_ADD_TIME(job.createdAt)}
          </span>
        </div>
      </div>
    </div>
  )
}
