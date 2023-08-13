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
  },
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mx-auto max-w-screen-lg px-4 lg:px-0">{children}</div>
}
