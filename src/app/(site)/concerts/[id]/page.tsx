import { Suspense } from "react"
import { Metadata } from "next/types"
import SupabaseServer from "@/lib/supabase-server"
import Loading from "@/components/ui/Loading/Loading"
import DataProvider from "./DataProvider"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .from("concerts")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    return {}
  }

  const pageTitle = data?.title.substring(0, 35)
  const pageDesc = (data?.contents || "").substring(0, 100)
  const pageImage = data?.poster_url

  console.log("pageImage", pageImage)

  return {
    title: `${pageTitle}|아트인포`,
    description: "아트인포 공연",
    openGraph: {
      title: pageTitle,
      description: "아트인포 공연",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <DataProvider pageId={params.id} />
    </Suspense>
  )
}
