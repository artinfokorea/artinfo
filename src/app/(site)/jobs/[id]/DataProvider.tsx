import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { fetchJob } from "@/app/Api"
import Container from "./Container"

interface IProps {
  pageId: string
}

export default async function DataProvider({ pageId }: IProps) {
  const jobId = Number(pageId)

  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["job", jobId], () => fetchJob(jobId))
  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    <Container jobId={jobId} />
    // </Hydrate>
  )
}
