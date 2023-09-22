import { Suspense } from "react"
import { Metadata } from "next/types"
import SupabaseServer from "@/lib/supabase-server"
import Loading from "@/components/ui/Loading/Loading"
import Container from "./Container"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .from("recruit_jobs")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    return {}
  }

  const pageTitle = (data?.title || data?.contents || "").substring(0, 35)
  const pageDesc = (data?.contents || "").substring(0, 100)
  const pageImage = data?.company_image_url

  console.log("pageImage", pageImage)

  return {
    title: `${pageTitle}|아트인포`,
    description: pageDesc,
    openGraph: {
      title: pageTitle,
      description: pageDesc,
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
      <Container jobId={Number(params.id)} />
    </Suspense>
  )
}
