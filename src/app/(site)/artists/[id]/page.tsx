import { getArtist } from "@/apis/artist"
import Loading from "@/components/ui/Loading/Loading"
import GetQueryClient from "@/app/GetQueryClient"
import ArtistDetailContatiner from "@/components/ui/Artists/ArtistDetailContainer"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import React, { Suspense } from "react"

interface Props {
  params: { id: string }
}

const page = async ({ params: { id } }: Props) => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["artist", id],
    queryFn: () => getArtist(Number(id)),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Suspense fallback={<Loading />}>
      <Hydrate state={dehydratedState}>
        <ArtistDetailContatiner />
      </Hydrate>
    </Suspense>
  )
}

export default page
