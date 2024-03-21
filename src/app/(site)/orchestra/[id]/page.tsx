import { getMe } from "@/apis/user"
import SecretDetailContainer from "@/components/ui/Secret/DetailContainer"
import SupabaseServer from "@/lib/supabase-server"
import { COMPANY_CATEGORY_ITEMS } from "@/types/types"
import { redirect } from "next/navigation"
import React from "react"

type Props = {
  params: { id: string }
}

const page = async ({ params }: Props) => {
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/auth")
  }

  const response = await getMe(data.session?.user.id)

  if (response.companyCategory !== COMPANY_CATEGORY_ITEMS.ORCHESTRA) {
    redirect("company-certification")
  }

  return (
    <main className="mx-auto max-w-screen-md py-8">
      <SecretDetailContainer pageId={params.id} />
    </main>
  )
}

export default page
