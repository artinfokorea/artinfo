import { getMe } from "@/apis/user"
import SecretContainer from "@/components/ui/Secret/SecretContainer"
import SupabaseServer from "@/lib/supabase-server"
import { COMPANY_CATEGORY_ITEMS } from "@/types/types"
import { redirect } from "next/navigation"
import React from "react"

const page = async () => {
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("auth")
  }

  const response = await getMe(data.session?.user.id)

  if (response.companyCategory !== COMPANY_CATEGORY_ITEMS.ORCHESTRA) {
    redirect("company-certification")
  }

  return (
    <main>
      <SecretContainer />
    </main>
  )
}

export default page
