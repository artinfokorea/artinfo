// import { getJobs } from "@/apis/job"
// import { createQueryKeys } from "@lukemorales/query-key-factory"

// export const users = createQueryKeys("jobs", {
//   list: (selectedMajorList: string[]) => ({
//     queryKey: ["recruit_jobs", selectedMajorList],
//     queryFn: ({ pageParam = 1 }) => getJobs(pageParam, selectedMajorList),
//     getNextPageParam: (lastPage: any) => {
//       if (!lastPage.isLast) return lastPage.nextPage
//       return null
//     },
//   }),
// })
