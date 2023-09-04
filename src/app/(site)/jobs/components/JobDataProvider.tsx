import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import { fetchJobs } from "@/app/Api"
import JobContainer from "./JobContainer"

export default function JobDataProvider() {
  // const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["jobs", "ALL"], () => fetchJobs("ALL", 1))
  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    <JobContainer />
    // </Hydrate>
  )
}
