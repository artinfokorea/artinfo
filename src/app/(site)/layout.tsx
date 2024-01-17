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
    <div className="relative z-1 h-full overflow-y-auto mb-20 md:mb-10 mt-[58px]">
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <RecoilProvider>
              <ToasterProvider>
                <Header />
                {children}
                <HomeScreenContainer />
                <BottomNavigation />
              </ToasterProvider>
            </RecoilProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </div>
  )
}
