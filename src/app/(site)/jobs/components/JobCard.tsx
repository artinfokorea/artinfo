"use client"

import PositionTag from "@/components/ui/PositionTag"
import useFilters from "@/hooks/useFilters"
import { Job, RECRUIT_JOBS_CATEGORY_ITEMS } from "@/types/types"
import Image from "next/image"

interface IProps {
  job: Job
}

export default function JobCard({ job }: IProps) {
  const filters = useFilters()

  return (
    <div className="card  rounded ">
      <div className="overflow-hidden relative h-[150px]">
        {/* {job.company_image_url && (
          <Image
            src={job.company_image_url}
            alt="concert-image"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 276px, 150px"
            className="max-w-full hover:scale-125 transition ease delay-200"
          />
        )} */}
        {job.company_image_url && (
          <Image
            src={job.company_image_url ?? "/img/placeholder_user.png"}
            alt="job"
            placeholder="blur"
            blurDataURL="/img/placeholder_user.png"
            sizes="(max-width: 1200px) 276px, 150px"
            fill
            className="hover:scale-125 transition ease delay-100 "
          />
        )}
      </div>
      <div className="py-2">
        <div className="flex flex-col  mb-1">
          <div className="text-sm  text-darkgrey truncate flex-1 my-2 flex items-center ">
            <span className="mr-2">
              <PositionTag tag={RECRUIT_JOBS_CATEGORY_ITEMS[job.category]} />
            </span>
            <span>{job.company_name} </span>
          </div>
          <div className="text-lg font-semibold my-2 line-clamp-3 break-keep">
            {job.title}
          </div>
          <span className="text- text-darkgrey">
            {filters.YYYYMMDD(job.created_at)}
          </span>
        </div>

        {/* <div className="mt-2 flex flex-wrap gap-x-1.5 gap-y-2">
          {job.job_positions.map(position => (
            <span
              key={`${job.id}-${position.position_1depth_category}-${position.position_2depth_category}`}
              className="text-indigo-600 text-xs border border-indigo-600 rounded-xl px-3 py-1"
            >
              {
                (JOB_POSITION_1DEPTH_CATEGORY_ITEMS as any)[
                  position.position_1depth_category
                ]
              }
            </span>
          ))}
        </div> */}

        {/* {job.start_date && job.duedate && (
          <div className="text-sm">
            {filters.YYYYMMDD(job.start_date)} ~ {filters.YYYYMMDD(job.duedate)}
          </div>
        )} */}

        {/* <div className="mt-3">
          <button className="border border-indigo-800 px-4 py-2 w-full rounded text-indigo-600 text-sm">
            지원하기
          </button>
        </div> */}
      </div>
    </div>
  )
}
