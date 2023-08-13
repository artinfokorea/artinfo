"use client"

import useSupabase from "@/hooks/useSupabase"
import type { AuthError, User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getMessaging, getToken, onMessage } from "firebase/messaging"
import { initializeApp } from "firebase/app"
import useSnackbar from "@/hooks/useSnackbar"

export const AuthContext = createContext<any>(null)

interface IProps {
  children: React.ReactNode
}

const fcmConfig = {
  apiKey: "AIzaSyBFRNarqYsPUKBLjNm2qwvULSfd3aQgW2M",
  authDomain: "artinfo-c5248.firebaseapp.com",
  projectId: "artinfo-c5248",
  storageBucket: "artinfo-c5248.appspot.com",
  messagingSenderId: "1096388696027",
  appId: "1:1096388696027:web:fa6a7c8a54b62182d6f9fe",
  measurementId: "G-51D21Q695N",
}
const firebaseApp = initializeApp(fcmConfig)

export default function AuthProvider({ children }: IProps) {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)

  const supabase = useSupabase()
  const router = useRouter()

  const [openSnackbar, closeSnackbar] = useSnackbar({
    position: "top-center",
    style: {},
  })

  async function getActiveSession() {
    const {
      data: { session: activeSession },
    } = await supabase.auth.getSession()
    setUser(activeSession?.user)
    setIsLoading(false)

    getFcmToken(activeSession?.user)
  }

  async function getFcmToken(user: any) {
    if (!user) {
      return
    }

    const isSupported =
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window

    if (isSupported) {
      const messaging = getMessaging(firebaseApp)
      const token = await getToken(messaging, {
        vapidKey:
          "BAmSb8SmdCYbDsckO68O9ejK4A0QONSGZTOJI0SPBM6x0LlFYrP0U8IbQXv17CeakTD28xvMelWaCUIve_LK9rI",
      })
      await supabase
        .from("profiles")
        .update({
          fcm_web_token: token,
        })
        .eq("id", user.id)

      onMessage(messaging, (fcmMessage: any) => {
        console.log(fcmMessage)
        const text = `${fcmMessage.data.title}\r\n${fcmMessage.data.body}`
        openSnackbar(text, 4000)
      })
    }
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
