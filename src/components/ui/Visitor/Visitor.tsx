"use client"

import { getStatistics, increaseOfVisitors } from "@/apis/statistics"
import useFilters from "@/hooks/useFilters"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"

const Visitor = () => {
  const filters = useFilters()

  const { data: statistics } = useQuery({
    queryKey: ["statistics"],
    queryFn: () => getStatistics(),
  })

  useEffect(() => {
    increaseOfVisitors()
  }, [])

  return (
    <section className="bg-white mb-2 rounded-lg shadow-md p-4 flex justify-center">
      <div className="flex items-center mr-8 md:mr-20">
        <span className="text-sm md:text-base font-semibold mr-4">Members</span>
        <span className="text-base md:text-lg  text-cornflowerblue font-bold">
          {filters.FEECOMMA(statistics?.users || 0)}
        </span>
      </div>
      <div className="flex items-center">
        <span className="text-sm md:text-base font-semibold mr-4">Today</span>
        <span className="text-base md:text-lg text-cornflowerblue font-bold">
          {filters.FEECOMMA(statistics?.visitors || 0)}
        </span>
      </div>
    </section>
  )
}

export default Visitor
