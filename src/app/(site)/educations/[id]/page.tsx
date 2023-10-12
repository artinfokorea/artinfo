import { Suspense } from "react"
import { Metadata } from "next/types"
import SupabaseServer from "@/lib/supabase-server"
import Loading from "@/components/ui/Loading/Loading"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import EducationDetailContainer from "@/components/ui/Education/EducationDetailContainer"
import { fetchLesson } from "@/app/Api"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const { id } = params

  // fetch data
  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    return {}
  }

  const pageTitle = (data?.title || data?.content || "").substring(0, 35)
  const pageDesc = (data?.content || "").substring(0, 100)
  const pageImages = data?.image_urls?.map((img: string) => ({
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

const page = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id)

  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["lesson", id], () => fetchLesson(id))
  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="mx-auto max-w-screen-lg">
      <Suspense fallback={<Loading />}>
        <Hydrate state={dehydratedState}>
          <EducationDetailContainer pageId={params.id} />
        </Hydrate>
      </Suspense>
    </div>
  )
}

export default page
