import { AuthContext } from "@/app/(auth)/auth/components/AuthProvider"
import { AuthError, User } from "@supabase/supabase-js"
import { useContext } from "react"

export default function useAuth() {
  const context = useContext<{
    isLoading: boolean
    user?: User
    signOut: () => Promise<{
      error: AuthError | null
    }>
  }>(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
