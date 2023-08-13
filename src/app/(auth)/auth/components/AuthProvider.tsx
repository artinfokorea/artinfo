"use client"

import useSupabase from "@/hooks/useSupabase"
import type { AuthError, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export const AuthContext = createContext<any>(null)

interface IProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: IProps) {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)

  const supabase = useSupabase()
  const router = useRouter()

  async function getActiveSession() {
    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession()
    // console.log(activeSession?.user)
    setUser(activeSession?.user)
    setIsLoading(false)
  }

  useEffect(() => {
    getActiveSession()

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // console.log(event, currentSession)
      setUser(currentSession?.user)
    })

    return () => {
      authListener?.unsubscribe()
    }
  }, [])

  // const value = useMemo(() => {
  //   return {
  //     user,
  //     signOut: () => supabase.auth.signOut(),
  //   }
  // }, [user])

  const signOut = async () => {
    await supabase.auth.signOut()

    router.refresh()
  }
  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
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
