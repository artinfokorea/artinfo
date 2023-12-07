import useFilters from "@/hooks/useFilters"
import Image from "next/image"
import React from "react"

interface Props {
  concert: {
    id: number
    title: string
    location: string
    performanceTime: string
    isActive: boolean
  }
}

const ArtistConcertCard = ({ concert }: Props) => {
  const filters = useFilters()

  return (
    <section
      className={`card flex p-4 my-1 bg-white  ${
        concert.isActive ? "border-4 border-blue-gray-300" : ""
      } `}
    >
      <div className="flex flex-col flex-1 mx-4 text-primary justify-center">
        <span className="font-semibold break-keep">{concert.title}</span>
        <span className="text-xs">{concert.location}</span>
      </div>
      {concert.isActive}
      <div className="flex items-center flex-col justify-center ">
        <span className="opacity-70">
          {filters.YYYYMMDD(concert.performanceTime)}
        </span>
        {concert.isActive && (
          <span className="bg-[#f8f8f9] px-2 py-1 rounded-2xl font-semibold">
            바로가기
          </span>
        )}
      </div>
    </section>
  )
}

export default ArtistConcertCard
