import useSupabase from "@/hooks/useSupabase"

export async function fetchOrganizations(page: number) {
  const supabase = useSupabase()
  const {
    data: organizations,
    count,
    error,
  } = await supabase
    .from("organizations")
    .select("id, name, logo_image", {
      count: "exact",
    })
    .limit(10)
    .range((page - 1) * 10, page * 10 - 1)

  if (error) {
    throw error
  }
  return { organizations, count }
}
export async function fetchOrganization(id: number) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }
  return data
}
