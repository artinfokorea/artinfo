import JobDetailContainer from "@/components/ui/Job/JobDetailContainer"
import GetQueryClient from "@/app/GetQueryClient"
import { getJob } from "@/apis/job"
import { Hydrate, dehydrate } from "@tanstack/react-query"

interface Props {
  params: {
    id: string
  }
}

export default async function JobPage({ params }: Props) {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["job", params.id],
    queryFn: () => getJob(Number(params.id)),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <JobDetailContainer jobId={Number(params.id)} />
    </Hydrate>
  )
}
