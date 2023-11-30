import React from "react"
import { useParams } from "next/navigation"
import { getConcertsByArtist } from "@/apis/concert"
import { useQuery } from "@tanstack/react-query"
import { CONCERT } from "@/types/types"
import Link from "next/link"
import ArtistConcerCard from "./ArtistConcerCard"

const ArtistDetailConcert = () => {
  const params = useParams()

  const { data: concerts } = useQuery({
    queryKey: ["artist_concerts", params.id],
    suspense: false,
    queryFn: () => getConcertsByArtist(Number(params.id)),
  })

  console.log("concerts", concerts)

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
      <div className="flex flex-col mb-2">
        {concerts?.map((concert: CONCERT) => {
          if (concert.isActive) {
            return (
              <Link
                key={concert.id}
                href={`/concerts/${concert.id}`}
                prefetch={false}
              >
                <ArtistConcerCard concert={concert} />
              </Link>
            )
          }
          return <ArtistConcerCard key={concert.id} concert={concert} />
        })}
      </div>
    </div>
  )
}

export default ArtistDetailConcert
