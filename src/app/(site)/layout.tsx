import "../globals.css"
import Header from "@/components/layouts/header"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/material"
import SnackbarProvider from "@/components/ui/Snackbar"
import { BottomNavigation } from "@/components/layouts/bottom-naviation"
import HomeScreenContainer from "@/components/ui/HomeScreen/HomeScreenContainer"
import Head from "next/head"
import QueryProvider from "../QueryProvider"
import AuthProvider from "../(auth)/auth/components/AuthProvider"

// import { Noto_Sans_KR, Roboto } from "next/font/google"

// const notoSansKr = Noto_Sans_KR({
//   // preload: true, 기본값
//   subsets: ["latin"], // 또는 preload: false
//   weight: ["100", "400", "700", "900"], // 가변 폰트가 아닌 경우, 사용할 fontWeight 배열
// })

// const roboto = Roboto({
//   subsets: ["latin"], // preload에 사용할 subsets입니다.
//   weight: ["100", "400", "700"],
//   variable: "--roboto", // CSS 변수 방식으로 스타일을 지정할 경우에 사용합니다.
// })

export const metadata: Metadata = {
  title: "아트인포-ARTINFO",
  description: "아트인포",
  openGraph: {
    title: "아트인포-ARTINFO",
    description: "아트인포",
    url: "http://artinfokorea.com",
    siteName: "ARTINFO",
    locale: "ko-KR",
    type: "website",
  },
}

const cls = (...classnames: string[]) => {
  return classnames.join(" ")
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      {/* <body className={cls(notoSansKr.className, roboto.variable)}> */}
      <body className="bg-[#f8fafc] flex flex-col h-full">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <SnackbarProvider>
                <Header />
                <main className="flex-1 overflow-y-auto">{children}</main>
                <BottomNavigation />
                <HomeScreenContainer />
              </SnackbarProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
