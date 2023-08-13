import { Suspense } from "react"
import { Metadata } from "next/types"
import SupabaseServer from "@/lib/supabase-server"
import Loading from "../loading"
import { DataProvider } from "./DataProvider"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  // read route params
  const { id } = params

  // fetch data
  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .rpc("get_feed", {
      feed_id: Number(id),
    })
    .single()

  if (error) {
    return {}
  }

  const pageTitle = (data?.title || data?.content || "").substring(0, 35)
  const pageDesc = (data?.content || "").substring(0, 100)
  const pageImages = data?.image_urls?.map(img => ({
    url: img,
  }))

  return {
    title: `${pageTitle}|아트인포`,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      images: pageImages,
    },
  }
}

export default function PostDetail({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-screen-lg">
      <Suspense fallback={<Loading />}>
        <DataProvider pageId={params.id} />
      </Suspense>
    </div>
  )
}
