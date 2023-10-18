import { Suspense } from "react"
import { Metadata } from "next/types"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import Loading from "@/components/common/Loading"
import JobContainer from "../../../components/ui/Job/JobContainer"

export async function generateMetadata(): Promise<Metadata> {
  return {
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
}
export default function Recruits() {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold mb-4">채용</h2>
        <ChipButton url="/jobs/create" title="채용등록" />
      </div>
      <Suspense fallback={<Loading />}>
        <JobContainer />
      </Suspense>
    </div>
  )
}
