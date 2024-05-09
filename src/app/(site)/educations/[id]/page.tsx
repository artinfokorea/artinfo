import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import EducationDetailContainer from "@/components/ui/Education/EducationDetailContainer"
import { getLesson } from "@/apis/lesson"
import EducationDetailServerContainer from "@/components/ui/Education/EducationDetailServerContainer"
import { PageType } from "@/interface/common"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
  searchParams?: { [key: string]: PageType }
}

const page = async ({ params, searchParams }: Props) => {
  const id = Number(params.id)

  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery({
  //   queryKey: ["lesson", id],
  //   queryFn: () => getLesson(Number(id)),
  // })
  // const dehydratedState = dehydrate(queryClient)

  const lesson = await getLesson(id)

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
