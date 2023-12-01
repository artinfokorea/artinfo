import { Suspense } from "react"
import { Metadata } from "next/types"
import { getFeed } from "@/apis/feed"
import Loading from "@/components/ui/Loading/Loading"
import Container from "./Container"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = params

  // fetch data
  // const supabase = SupabaseServer()
  // const { data, error } = await supabase
  //   .rpc("get_feed", {
  //     feed_id: Number(id),
  //   })
  //   .single()
  const response = await getFeed(Number(id))

  if (!response) {
    return {}
  }

  // if (error) {
  //   return {}
  // }

  const pageTitle = (response?.title || response?.contents || "").substring(
    0,
    35,
  )
  const pageDesc = (response?.contents || "").substring(0, 100)
  const pageImages = response?.imageUrls?.map(img => ({
    url: img,
  }))

  console.log("pageImages", pageImages)

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
  // const supabase = SupabaseServer()

  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["feed", params.id], async () => {
  //   const { data, error } = await supabase
  //     .rpc("get_feed", {
  //       feed_id: Number(params.id),
  //     })
  //     .single()
  //   if (error) throw error

  //   await supabase.rpc("increment_feed_view", {
  //     feed_id: Number(params.id),
  //   })
  //   return data
  // })
  // const dehydratedState = dehydrate(queryClient)

  return (
    <div className="mx-auto max-w-screen-lg">
      <Suspense fallback={<Loading />}>
        {/* <Hydrate state={dehydratedState}> */}
        <Container pageId={params.id} />
        {/* </Hydrate> */}
      </Suspense>
    </div>
  )
}
