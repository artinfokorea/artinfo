import { fetchJobs } from "@/app/(admin)/admin/jobs/api"
import { createQueryKeys } from "@lukemorales/query-key-factory"

export const jobsKeys = createQueryKeys("recruit_jobs", {
  list: (filters: { page: number }) => ({
    queryKey: [{ filters }],
    queryFn: () => fetchJobs(filters),
  }),
})
