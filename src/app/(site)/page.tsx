import { Hydrate, dehydrate } from "@tanstack/react-query"
import { getFeeds } from "@/apis/feed"
import Container from "../../components/ui/Post/Container"
import GetQueryClient from "../GetQueryClient"
import { fetchAds, fetchBanners, fetchJobs } from "../Api"

export const revalidate = 10 // revalidate this page every 60 seconds

export default async function page() {
  const queryClient = GetQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["feeds"],
    queryFn: () => {
      return getFeeds(1)
    },
  })

  await queryClient.prefetchQuery({
    queryKey: ["banners"],
    queryFn: () => fetchBanners(),
  })

  await queryClient.prefetchQuery({
    queryKey: ["ads"],
    queryFn: () => fetchAds(),
  })

  await queryClient.prefetchQuery({
    queryKey: ["jobs"],
    queryFn: () => fetchJobs("ALL", 1),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <Container />
    </Hydrate>
  )
}
