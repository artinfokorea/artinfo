import { Metadata } from "next/types"
import { getFeed } from "@/apis/feed"
import SupabaseServer from "@/lib/supabase-server"
import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import Container from "./Container"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()

  const response = await getFeed(Number(id), data.session?.user.id)

  const pageTitle = (response?.title || response?.contents || "").substring(
    0,
    35,
  )
  const pageDesc = (response?.contents || "").substring(0, 100)
  const pageImages = response?.imageUrls?.map(img => ({
    url: img,
  }))

  return {
    title: `${pageTitle}|아트인포`,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      images: pageImages ?? {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default async function PostDetail({
  params,
}: {
  params: { id: string }
}) {
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()
  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["artist_feed", params.id],
    queryFn: () => getFeed(Number(params.id), data.session?.user.id),
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="mx-auto max-w-screen-lg">
      <Hydrate state={dehydratedState}>
        <Container pageId={params.id} />
      </Hydrate>
    </div>
  )
}
