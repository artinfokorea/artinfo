import useSupabase from "@/hooks/useSupabase"

export async function fetchJobs(page: number) {
  const supabase = useSupabase()
  const {
    data: jobs,
    count,
    error,
  } = await supabase
    .from("recruit_jobs")
    .select("*", {
      count: "exact",
    })
    .limit(10)
    .range((page - 1) * 10, page * 10 - 1)

  if (error) {
    throw error
  }
  return { jobs, count }
}
export async function fetchJob(id: number) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("recruit_jobs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }
  return data
}
