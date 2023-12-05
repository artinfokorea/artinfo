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

const ArtistConcerCard = ({ concert }: Props) => {
  const filters = useFilters()
  return (
    <section className="card flex p-4 my-1 bg-white">
      <div className="flex flex-col flex-1 mx-4 text-primary justify-center">
        <span className="font-semibold break-keep">{concert.title}</span>
        <span className="text-xs">{concert.location}</span>
      </div>
      <div className="flex items-center opacity-70">
        {filters.YYYYMMDD(concert.performanceTime)}
      </div>
    </section>
  )
}

export default ArtistConcerCard
