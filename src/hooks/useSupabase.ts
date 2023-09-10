import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

export default function useSupabase() {
  // const supabase = createServerComponentClient<Database>({ cookies })
  const supabase = createClientComponentClient<Database>()
  return supabase
}
