import "../globals.css"
import Header from "@/components/layouts/header"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/material"
import { BottomNavigation } from "@/components/layouts/bottom-naviation"
import HomeScreenContainer from "@/components/ui/HomeScreen/HomeScreenContainer"
import QueryProvider from "../QueryProvider"
import AuthProvider from "../../components/ui/Auth/AuthProvider"
import RecoilProvider from "../RecoilProvider"
import ToasterProvider from "../ToasterProvider"

export const metadata: Metadata = {
  title: "아트인포-ARTINFO",
  description:
    "음악의 중심 아트인포! 클래식 공연부터 채용, 레슨, 입시 정보까지 모든 음악 정보를 아트인포에서 찾아보세요",
  openGraph: {
    title: "아트인포-ARTINFO",
    description:
      "음악의 중심 아트인포! 클래식 공연부터 채용, 레슨, 입시 정보까지 모든 음악 정보를 아트인포에서 찾아보세요",
    url: "http://artinfokorea.com",
    siteName: "ARTINFO",
    locale: "ko-KR",
    type: "website",
    images: [
      {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/289/1694427431399.jpg",
        width: 580,
        height: 580,
        alt: "아트인포-ARTINFO",
      },
    ],
  },
}
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="touch-manipulation bg-[#f8fafc] h-screen">
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <RecoilProvider>
                <ToasterProvider>
                  <main className="flex-1 relative z-1 mt-[58px] h-full ">
                    <Header />
                    {children}
                    <HomeScreenContainer />
                    <BottomNavigation />
                  </main>
                </ToasterProvider>
              </RecoilProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
