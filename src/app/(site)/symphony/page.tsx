import SupabaseServer from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("company-certification")
  }

  return <div>교향악단</div>
}

export default page
