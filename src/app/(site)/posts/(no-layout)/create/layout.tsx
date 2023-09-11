import type { Metadata } from "next"

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
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mx-auto max-w-screen-lg px-4 lg:px-0">{children}</div>
}
