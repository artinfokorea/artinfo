import { getYoutubeListByArtist } from "@/apis/youtube"
import { YOUTUBE } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import React from "react"
import ArtistYoutbeCard from "./ArtistYoutbeCard"

const ArtistDetailYoutube = () => {
  const params = useParams()

  const { data: youtubes } = useQuery({
    queryKey: [`artist_youtubes_${params.id}`, params.id],
    suspense: false,
    queryFn: () => getYoutubeListByArtist(Number(params.id)),
  })

  // console.log("youtubes", youtubes)

  return (
    <div className="mb-8">
      {youtubes?.map((youtube: YOUTUBE) => (
        <ArtistYoutbeCard key={youtube.id} youtube={youtube} />
      ))}
    </div>
  )
}

export default ArtistDetailYoutube
