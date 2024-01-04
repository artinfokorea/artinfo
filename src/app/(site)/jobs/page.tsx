"use client"

import { useState } from "react"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import JobSkeleton from "@/components/ui/Skeleton/JobSkeleton"
import JobContainer from "../../../components/ui/Job/JobContainer"

export default function Recruits() {
  const [isMajorSelect, setIsMajorSelect] = useState(false)

  const handleMajorModal = () => setIsMajorSelect(!isMajorSelect)

  return (
    <div className="sm:container mx-auto pt-4 px-4 ">
      <div className="flex justify-between">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">채용</h2>
          <button
            onClick={handleMajorModal}
            className="flex ml-4 items-center rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400
          "
          >
            <span>전공 검색</span>
          </button>
        </div>
        <ChipButton url="/jobs/create" title="채용등록" />
      </div>
      <JobContainer
        isMajorSelect={isMajorSelect}
        handleMajorModal={handleMajorModal}
      />
    </div>
  )
}
