import useSupabase from "@/hooks/useSupabase"

export async function fetchInquiries(page: number) {
  const supabase = useSupabase()
  const {
    data: inquiries,
    error,
    count,
  } = await supabase
    .from("inquiries")
    .select("*", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .limit(10)
    .range((page - 1) * 10, page * 10 - 1)

  if (error) {
    throw error
  }
  return { inquiries, count }
}
export async function fetchInquiry(id: number) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }
  return data
}
