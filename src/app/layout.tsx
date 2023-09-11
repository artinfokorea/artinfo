import type { Metadata } from "next"
import Script from "next/script"
import * as gtag from "@/lib/gtag"

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
    images: [
      {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/289/1694427431399.jpg",
        width: 580,
        height: 580,
        alt: "아트인포-ARTINFO",
      },
    ],
  },
  viewport: {
    width: "width=device-width",
    initialScale: 1,
    viewportFit: "cover",
  },
  verification: {
    other: {
      "naver-site-verification": ["f40177a0b22957c1976295abef657fd8c8dce9e6"],
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="manifest" href="/manifest.json" />
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
      <body>{children}</body>
    </html>
  )
}
