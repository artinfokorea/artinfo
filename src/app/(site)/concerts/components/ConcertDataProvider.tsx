import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import { fetchConcerts } from "@/app/Api"
import ConcertContainer from "./ConcertContainer"

export default async function ConcertDataProvider() {
  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["concerts", "ALL"], () => fetchConcerts())
  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    //   <ConcertContainer />
    // </Hydrate>
    <ConcertContainer />
  )
}
