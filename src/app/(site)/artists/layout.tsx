import { Metadata } from "next/types"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `아티스트 | 아트인포`,
    description: `아티스트 | 아트인포`,
    openGraph: {
      title: `아티스트 | 아트인포`,
      description: "아트인포 아티스트",
      images: {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function ArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-whitesmoke h-full">{children}</div>
}
