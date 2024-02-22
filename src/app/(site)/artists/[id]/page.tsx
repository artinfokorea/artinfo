import { getArtist } from "@/apis/artist"
import GetQueryClient from "@/app/GetQueryClient"
import ArtistDetailContatiner from "@/components/ui/Artists/ArtistDetailContainer"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { Metadata } from "next"

interface Props {
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

const page = async ({ params: { id } }: Props) => {
  const queryClient = GetQueryClient()

  await queryClient.prefetchQuery({
    queryKey: ["artist", id],
    queryFn: () => getArtist(Number(id)),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <ArtistDetailContatiner />
    </Hydrate>
  )
}

export default page
