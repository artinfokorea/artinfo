"use client"

import { Suspense } from "react"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import JobSkeleton from "@/components/ui/Skeleton/JobSkeleton"
import JobContainer from "../../../components/ui/Job/JobContainer"

export default function Recruits() {
  return (
    <div className="sm:container mx-auto mt-4 px-4 ">
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold mb-4">채용</h2>
        <ChipButton url="/jobs/create" title="채용등록" />
      </div>
      <JobContainer />
    </div>
  )
}
