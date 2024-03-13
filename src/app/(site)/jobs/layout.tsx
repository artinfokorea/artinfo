import { Metadata } from "next/types"

export const metadata: Metadata = {
  title: `채용 | 아트인포`,
  description: `채용 | 아트인포`,
  openGraph: {
    title: `채용 | 아트인포`,
    description: `채용 | 아트인포`,
    images: {
      url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
      alt: "아트인포-ARTINFO",
    },
  },
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div>{children}</div>
}
