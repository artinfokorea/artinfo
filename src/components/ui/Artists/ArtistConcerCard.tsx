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
    <section className="card flex px-4 m-4">
      <div className="flex flex-col flex-1">
        <span>{concert.title}</span>
        <span className="text-xs text-primary">{concert.location}</span>
      </div>

      <div className="flex items-center opacity-70">
        {filters.YYYYMMDD(concert.performanceTime)}
      </div>
    </section>
  )
}

export default ArtistConcerCard
