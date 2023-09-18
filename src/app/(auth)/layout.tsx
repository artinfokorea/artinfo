import "../globals.css"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/material"
import QueryProvider from "../QueryProvider"

export const metadata: Metadata = {
  title: "로그인",
  description: "로그인 페이지",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="touch-manipulation bg-[#f8fafc]">
        <ThemeProvider>
          <QueryProvider>
            <main className="">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
