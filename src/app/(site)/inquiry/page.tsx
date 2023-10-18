import InquiryContainer from "@/components/ui/Inquiry/InquiryContainer"
import { Metadata } from "next/types"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `문의 | 아트인포`,
    description: `문의 | 아트인포`,
    openGraph: {
      title: `문의 | 아트인포`,
      description: `문의 | 아트인포`,
      images: {
        url: "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default function CreatePost() {
  return (
    <div>
      <InquiryContainer />
    </div>
  )
}
