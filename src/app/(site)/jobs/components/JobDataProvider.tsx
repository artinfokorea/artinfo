import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import { fetchJobs } from "@/app/Api"
import JobContainer from "./JobContainer"

export default async function JobDataProvider() {
  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["jobs", "ALL"], () => fetchJobs("ALL"))
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <JobContainer />
    </Hydrate>
  )
}
