"use client"

import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import ConcertContainer from "../../../components/ui/Concert/ConcertContainer"

export default function Concerts() {
  return (
    <div className="sm:container mx-auto mt-4 px-4 ">
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold mb-4">공연</h2>
        <ChipButton url="/concerts/create" title="공연등록" />
      </div>
      <ConcertContainer />
    </div>
  )
}
