import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import SupabaseServer from "@/lib/supabase-server"
import Container from "./Container"

interface IProps {
  pageId: string
}

export async function DataProvider({ pageId }: IProps) {
  const supabase = SupabaseServer()

  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["feed", pageId], async () => {
    const { data, error } = await supabase
      .rpc("get_feed", {
        feed_id: pageId,
      })
      .single()
    if (error) throw error
    return data
  })
  const dehydratedState = dehydrate(queryClient)
  return (
    <Hydrate state={dehydratedState}>
      <Container pageId={pageId} />
    </Hydrate>
  )
}
