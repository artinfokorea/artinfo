import { getLesson } from "@/apis/lesson"
import { Metadata } from "next"
import React from "react"

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params

  const data = await getLesson(Number(id))

  const pageTitle = data?.name
  const pageImage = data?.imageUrl
  const pageDesc = data?.intro.substring(0, 35)

  return {
    title: `${pageTitle} | 레슨`,
    description: pageDesc,
    openGraph: {
      title: `${pageTitle} | 레슨`,
      description: pageDesc,
      images: pageImage ?? {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

const LessonLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export default LessonLayout
