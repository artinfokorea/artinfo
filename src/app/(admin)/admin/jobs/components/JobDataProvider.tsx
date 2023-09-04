// import { Hydrate, dehydrate } from "@tanstack/react-query"
// import GetQueryClient from "@/app/GetQueryClient"
// import { fetchJobs } from "../api"
import JobList from "./JobLIst"

export default function JobDataProvider() {
  // const prefetchData = async () => {
  //   const queryClient = GetQueryClient()

  //   await queryClient.prefetchQuery({
  //     queryKey: ["recruit_jobs"],
  //     queryFn: () => fetchJobs(1),
  //   })
  //   const dehydratedState = dehydrate(queryClient)
  //   return dehydratedState
  // }

  return (
    // <Hydrate state={prefetchData}>
    <JobList />
    // </Hydrate>
  )
}
