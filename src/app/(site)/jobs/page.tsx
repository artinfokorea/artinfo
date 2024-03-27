import GetQueryClient from "@/app/GetQueryClient"
import { getJobs } from "@/apis/job"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import JobContainer from "../../../components/ui/Job/JobContainer"

interface Props {
  searchParams: { majors: string }
}

export default async function JobsPage({ searchParams }: Props) {
  const { majors } = searchParams
  const selectedMajorList = majors ? majors.split(",") : []
  // const queryClient = GetQueryClient()

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["recruit_jobs", selectedMajorList],
  //   queryFn: () => {
  //     return getJobs(1, selectedMajorList)
  //   },
  // })

  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    <JobContainer />
    // </Hydrate>
  )
}
