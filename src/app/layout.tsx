import type { Metadata } from "next"
import Script from "next/script"
import * as gtag from "@/lib/gtag"

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
  manifest: "/manifest.json",
  viewport: {
    width: "width=device-width",
    initialScale: 1,
    minimumScale: 1,
    viewportFit: "cover",
    maximumScale: 1,
    userScalable: false,
  },
  verification: {
    other: {
      "naver-site-verification": ["eb1c30e483eed014548bceaa3325c74cc15490db"],
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
