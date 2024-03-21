import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import ConcertDetailContainer from "@/components/ui/Concert/ConcertDetailContainer"
import { getConcert } from "@/apis/concert"

export default async function page({ params }: { params: { id: string } }) {
  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["concert", params.id], () =>
    getConcert(params.id),
  )
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ConcertDetailContainer pageId={params.id} />
    </Hydrate>
  )
}
