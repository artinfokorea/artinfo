import React from "react"
import { useParams } from "next/navigation"
import { getConcertsByArtist } from "@/apis/concert"
import { useQuery } from "@tanstack/react-query"
import { ARTIST_CONCERT } from "@/types/types"
import Link from "next/link"
import ArtistConcertCard from "./ArtistConcertCard"
import { useAuth } from "../Auth/AuthProvider"

const adminId = process.env.NEXT_PUBLIC_ADMIN_ID

const ArtistDetailConcert = () => {
  const params = useParams()
  const { user } = useAuth()

  const { data: concerts } = useQuery({
    queryKey: [`artist_concerts_${params.id}`, params.id],
    suspense: false,
    queryFn: () => getConcertsByArtist(Number(params.id)),
  })

  return (
    <div id="top">
      <div className="flex flex-col mb-8">
        {concerts?.map((concert: ARTIST_CONCERT) => {
          return (
            <ArtistConcertCard
              key={concert.id}
              concert={concert}
              isAdmin={user?.id === adminId}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ArtistDetailConcert
