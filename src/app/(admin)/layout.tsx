import "../globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/material"
import QueryProvider from "@/app/QueryProvider"
// import SnackbarProvider from "@/components/ui/Snackbar/Snackbar"
import AuthProvider from "../(auth)/auth/components/AuthProvider"

export const metadata: Metadata = {
  title: "관리자",
  description: "관리자 페이지",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {/* <SnackbarProvider> */}
              <main className="">{children}</main>
              {/* </SnackbarProvider> */}
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
