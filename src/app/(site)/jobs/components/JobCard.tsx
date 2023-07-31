"use client"

import useFilters from "@/hooks/useFilters"
import {
  JOB_POSITION_1DEPTH_CATEGORY_ITEMS,
  JOB_POSITION_ADMINISTRATION_CATEGORY_ITEMS,
  JOB_POSITION_CHORUS_CATEGORY_ITEMS,
  JOB_POSITION_KOREAN_MUSIC_CATEGORY_ITEMS,
  JOB_POSITION_ORCHESTRA_CATEGORY_ITEMS,
  Job,
} from "@/types/types"
import Image from "next/image"
import { useMemo } from "react"

interface IProps {
  job: Job
}

export default function JobCard({ job }: IProps) {
  const addressArr = job.address.split(" ")
  const address = `${addressArr[0]} ${addressArr[1]}`

  const filters = useFilters()

  const remaininDays = useMemo(() => {
    if (filters.IS_DATE_FUTURE(job.start_date)) {
      return ": 접수대기"
    }
    if (!job.duedate) {
      return ": 상시모집"
    }
    if (filters.IS_DATE_FUTURE(job.duedate)) {
      const days = filters.DIFF_FROM_NOW(job.duedate)
      return `: ${days}일남음`
    }
    return ": 기한지남"
  }, [job.start_date, job.duedate, filters])

  // const jobPositionAllItems = {
  //   ...JOB_POSITION_ORCHESTRA_CATEGORY_ITEMS,
  //   ...JOB_POSITION_CHORUS_CATEGORY_ITEMS,
  //   ...JOB_POSITION_KOREAN_MUSIC_CATEGORY_ITEMS,
  //   ...JOB_POSITION_ADMINISTRATION_CATEGORY_ITEMS,
  // } as any

  return (
    <div className="card bg-white border border-stone-800 rounded">
      <div className="overflow-hidden relative" style={{ height: "150px" }}>
        {job.poster_images?.length && (
          <Image
            src={job.poster_images[0]}
            alt="Vercel Logo"
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 1200px) 276px, 150px"
            className="max-w-full hover:scale-125 transition ease delay-200"
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center mb-1">
          <div
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
          </div>
          <div className="text-sm truncate flex-1">
            {job.organizations?.name}
          </div>
        </div>
        <div className="text-base font-semibold mt-4 line-clamp-3">
          {job.title}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-1.5 gap-y-2">
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
        </div>
        <div className="mt-2 text-sm">{address}</div>

        {job.start_date && job.duedate && (
          <div className="text-sm">
            {filters.YYYYMMDD(job.start_date)} ~ {filters.YYYYMMDD(job.duedate)}
          </div>
        )}

        <div className="mt-3">
          <button className="border border-indigo-800 px-4 py-2 w-full rounded text-indigo-600 text-sm">
            지원하기 {remaininDays}
          </button>
        </div>
      </div>
    </div>
  )
}
