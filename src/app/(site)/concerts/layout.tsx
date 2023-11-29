import { Metadata } from "next/types"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `공연 | 아트인포`,
    description: `공연 | 아트인포`,
    openGraph: {
      title: `공연 | 아트인포`,
      description: "아트인포 공연",
      images: {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function ConcertsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="h-full">{children}</div>
}
