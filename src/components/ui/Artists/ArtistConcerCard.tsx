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
    <section className="card flex m-4">
      <div className="flex items-center opacity-70">
        {filters.YYYYMMDD(concert.performanceTime)}
      </div>
      <div className="flex flex-col flex-1 ml-4 text-primary">
        <span className="font-semibold">{concert.title}</span>
        <span className="text-xs">{concert.location}</span>
      </div>
    </section>
  )
}

export default ArtistConcerCard
