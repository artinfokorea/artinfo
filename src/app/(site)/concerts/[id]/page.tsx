import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import ConcertDetailContainer from "@/components/ui/Concert/ConcertDetailContainer"
import { getConcert } from "@/apis/concert"

// const baseURL = process.env.NEXT_PUBLIC_REST_API
// export const revalidate = 3600

// const fetchConcert = async (concertId: string) => {
//   const res = await fetch(`${baseURL}/concerts/${concertId}`, {
//     next: {
//       tags: ["test"],
//     },
//   })
//   return res.json()
// }

export default async function page({ params }: { params: { id: string } }) {
  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["concert", params.id], () =>
    getConcert(params.id),
  )
  const dehydratedState = dehydrate(queryClient)

  // const data = await fetchConcert(params.id)
  // console.log("data", data.title)

  return (
    <Hydrate state={dehydratedState}>
      <ConcertDetailContainer pageId={params.id} />
    </Hydrate>
  )
}
