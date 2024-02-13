import { getArtistList, getArtists } from "@/apis/artist"
import GetQueryClient from "@/app/GetQueryClient"
import ArtistsContainer from "@/components/ui/Artists/ArtistsContainer"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import React from "react"

const page = async () => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["artists"],
    queryFn: () => {
      return getArtists(1)
    },
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ArtistsContainer />
    </Hydrate>
  )
}

export default page
