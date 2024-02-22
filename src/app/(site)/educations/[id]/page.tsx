import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import EducationDetailContainer from "@/components/ui/Education/EducationDetailContainer"
import { getLesson } from "@/apis/lesson"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const page = async ({ params }: { params: { id: string } }) => {
  const id = Number(params.id)

  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLesson(Number(id)),
  })
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <EducationDetailContainer pageId={params.id} />
    </Hydrate>
  )
}

export default page
