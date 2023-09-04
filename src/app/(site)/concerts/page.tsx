"use client"

import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import ConcertContainer from "./components/ConcertContainer"

export default function Concerts() {
  return (
    <div className="sm:container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-4">공연</h2>
      <Suspense fallback={<Loading />}>
        <ConcertContainer />
      </Suspense>
    </div>
  )
}
