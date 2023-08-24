"use client"

import SelectMenu from "@/components/ui/SelectMenu"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS } from "@/types/types"
import Link from "next/link"
import { fetchJobs } from "@/app/Api"
import JobCard from "./JobCard"

export default function JobContainer() {
  const items = [
    { title: "전체", value: "ALL" },
    ...JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  ]

  const [position1depth, setPosition1depth] = useState("ALL")

  const { data: jobs } = useQuery({
    queryKey: ["jobs", position1depth],
    suspense: true,
    queryFn: () => fetchJobs(position1depth),
  })

  const updatedPosition1depth = (value: string) => {
    setPosition1depth(value)
  }

  const position1depthItem = items.find(item => item.value === position1depth)

  return (
    <div className="">
      <div className="mb-5 bg-white">
        <SelectMenu
          label="단체별"
          items={items}
          selectedItem={position1depthItem!}
          updateItem={updatedPosition1depth}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {jobs?.map(item => (
          <Link key={item.id} href={`/jobs/${item.id}`}>
            <JobCard job={item as any} />
          </Link>
        ))}
      </div>
    </div>
  )
}
