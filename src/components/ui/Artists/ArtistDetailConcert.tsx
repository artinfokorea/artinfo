import React from "react"
import { useParams } from "next/navigation"
import { getConcertsByArtist } from "@/apis/concert"
import { useQuery } from "@tanstack/react-query"
import { ARTIST_CONCERT } from "@/types/types"
import Link from "next/link"
import useFilters from "@/hooks/useFilters"
import ArtistConcertCard from "./ArtistConcertCard"

const ArtistDetailConcert = () => {
  const params = useParams()
  const filters = useFilters()

  const { data: concerts } = useQuery({
    queryKey: [`artist_concerts_${params.id}`, params.id],
    suspense: false,
    queryFn: () => getConcertsByArtist(Number(params.id)),
  })

  return (
    <div id="top">
      {/* {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
        </div>
      )} */}
      <div className="flex flex-col mb-8">
        {concerts?.map((concert: ARTIST_CONCERT) => {
          if (concert.isActive) {
            return (
              <Link
                key={concert.id}
                href={`/concerts/${concert.id}`}
                prefetch={false}
              >
                <ArtistConcertCard concert={concert} />
              </Link>
            )
          }
          return <ArtistConcertCard key={concert.id} concert={concert} />
        })}
      </div>
    </div>
  )
}

export default ArtistDetailConcert
