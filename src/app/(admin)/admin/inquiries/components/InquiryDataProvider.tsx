import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import { fetchInquiries } from "@/app/(admin)/admin/inquiries/api"
import InquiryList from "./InquiryList"

export default function InquiryDataProvider() {
  const prefetchData = async () => {
    "use server"

    const queryClient = GetQueryClient()
    await queryClient.prefetchQuery({
      queryKey: ["inquiries"],
      queryFn: () => fetchInquiries(1),
    })
    const dehydratedState = dehydrate(queryClient)
    return dehydratedState
  }

  return (
    <Hydrate state={prefetchData()}>
      <InquiryList />
    </Hydrate>
  )
}
