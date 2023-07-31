import useSupabase from "@/hooks/useSupabase"
import JobHomeCard from "./job-home-card"

export default async function JobContainer() {
  const supabase = useSupabase()
  const jobsResult = await supabase.rpc("get_jobs", {
    position_1depth: "ALL",
    position_2depths: [],
    limit_count: 4,
  })

  const jobs = jobsResult.data?.map(job => ({
    ...job,
    organizations: {
      id: (job.organizations as any).id,
      name: (job.organizations as any).name,
    },
  }))

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {jobs?.map(job => <JobHomeCard key={job.id} job={job} />)}
    </div>
  )
}
