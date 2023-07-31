import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// This needs to export a function, as the headers and cookies are not populated with values until the Server Component is requesting data.
export default function SupabaseServer() {
  return createServerComponentClient({
    cookies,
  })
}
