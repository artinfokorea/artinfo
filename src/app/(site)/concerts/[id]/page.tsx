import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { fetchConcert } from "@/app/Api"
import ConcertDetailContainer from "@/components/ui/Concert/ConcertDetailContainer"

export default async function page({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["concert", id], () => fetchConcert(id))
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ConcertDetailContainer pageId={id} />
    </Hydrate>
  )
}
