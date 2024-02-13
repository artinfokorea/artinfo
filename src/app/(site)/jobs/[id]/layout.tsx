import SupabaseServer from "@/lib/supabase-server"
import { Metadata } from "next"
import React from "react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const supabase = SupabaseServer()
  const { data, error } = await supabase
    .from("recruit_jobs")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    return {}
  }

  const pageTitle = data?.title.substring(0, 35)
  const pageImage = data?.company_image_url

  return {
    title: `채용 | 아트인포`,
    description: `${pageTitle} | 아트인포`,
    openGraph: {
      title: pageTitle,
      description: "아트인포 채용",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function JobLayout({ children }: { children: React.ReactNode }) {
  return <div className="touch-auto pb-20 md:pb-0">{children}</div>
}
