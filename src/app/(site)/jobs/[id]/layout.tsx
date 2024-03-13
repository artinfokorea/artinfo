import React from "react"
import { getJob } from "@/apis/job"
import { Metadata } from "next"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const data = await getJob(Number(id), "META")

  const pageTitle = data?.title.substring(0, 35)
  const pageImage = data?.companyImageUrl

  return {
    title: `채용 | ${pageTitle}`,
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
