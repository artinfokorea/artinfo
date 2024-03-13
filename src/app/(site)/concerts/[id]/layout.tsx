import { Metadata } from "next/types"
import SupabaseServer from "@/lib/supabase-server"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .from("concerts")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  const pageTitle = data?.title.substring(0, 35)
  const pageImage = data?.poster_url

  console.log("pageImage", pageImage)

  return {
    title: `공연 | ${pageTitle}`,
    description: `${pageTitle} | 아트인포`,
    openGraph: {
      title: pageTitle,
      description: "아트인포 공연",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function ConcertLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="touch-auto pt-6 pb-20 md:pb-0">{children}</div>
}
