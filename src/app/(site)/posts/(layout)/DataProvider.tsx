import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import Container from "./components/Container"

export async function DataProvider() {
  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["feeds"], () => fetchFeeds({}))
  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    //   <Container />
    // </Hydrate>
    <Container />
  )
}
