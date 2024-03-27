import { Hydrate, dehydrate } from "@tanstack/react-query"
import { getFeeds } from "@/apis/feed"
import SupabaseServer from "@/lib/supabase-server"
import Container from "../../components/ui/Post/Container"
import GetQueryClient from "../GetQueryClient"
import { fetchAds, fetchBanners, fetchJobs } from "../Api"

export const revalidate = 10 // revalidate this page every 60 seconds

export default async function page() {
  // const queryClient = GetQueryClient()
  // const supabase = SupabaseServer()
  // const { data } = await supabase.auth.getSession()

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["feeds"],
  //   queryFn: () => {
  //     return getFeeds({
  //       page: 1,
  //       requestUserId: data.session?.user.id,
  //       category: "ARTIST",
  //     })
  //   },
  // })

  // await queryClient.prefetchQuery({
  //   queryKey: ["banners"],
  //   queryFn: () => fetchBanners(),
  // })

  // await queryClient.prefetchQuery({
  //   queryKey: ["ads"],
  //   queryFn: () => fetchAds(),
  // })

  // await queryClient.prefetchQuery({
  //   queryKey: ["jobs"],
  //   queryFn: () => fetchJobs("ALL", 1),
  // })

  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    <Container />
    // </Hydrate>
  )
}
