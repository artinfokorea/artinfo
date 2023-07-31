import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/supabase"

export default function useSupabase() {
  // const supabase = createServerComponentClient<Database>({ cookies })
  const supabase = createClientComponentClient<Database>()
  return supabase
}
