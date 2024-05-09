import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import EducationDetailContainer from "@/components/ui/Education/EducationDetailContainer"
import { getLesson } from "@/apis/lesson"
import EducationDetailServerContainer from "@/components/ui/Education/EducationDetailServerContainer"
import { PageType } from "@/interface/common"
import { Metadata } from "next"

interface Props {
  params: { id: string }
  searchParams?: { [key: string]: PageType }
}

const getLessonDetail = async (id: string) => {
  const queryClient = GetQueryClient()
  const data = await queryClient.fetchQuery(["lesson", id], () => getLesson(id))

  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const data = await getLessonDetail(id)

  const pageTitle = data?.name
  const pageImage = data?.imageUrl
  const pageDesc = data?.intro.substring(0, 35)

  return {
    title: `${pageTitle} | 레슨`,
    description: pageDesc,
    openGraph: {
      title: `${pageTitle} | 레슨`,
      description: pageDesc,
      images: pageImage ?? {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

const page = async ({ params, searchParams }: Props) => {
  const { id } = params

  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery({
  //   queryKey: ["lesson", id],
  //   queryFn: () => getLesson(Number(id)),
  // })
  // const dehydratedState = dehydrate(queryClient)

  const lesson = await getLessonDetail(id)

  // console.log("lesson", lesson)

  return (
    // <Hydrate state={dehydratedState}>
    //   <EducationDetailContainer pageId={params.id} />
    // </Hydrate>

    <EducationDetailServerContainer
      lesson={lesson}
      searchParams={searchParams}
    />
  )

  // const lesson = await getLesson(id)
  // return (
  //   <EducationDetailServerContainer
  //     lesson={lesson}
  //     params={id}
  //     searchParams={searchParams}
  //   />
  // )
}

export default page
