import { getArtist } from "@/apis/artist"
import { Metadata } from "next/types"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const artist = await getArtist(Number(id))

  return {
    title: `${artist.koreanName} | 아트인포`,
    description: `${artist.koreanName} | 아트인포`,
    openGraph: {
      title: artist.koreanName,
      description: `${artist.koreanName} | 아트인포`,
      images: {
        url:
          artist.mainImageUrl ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="touch-auto">{children}</div>
}
