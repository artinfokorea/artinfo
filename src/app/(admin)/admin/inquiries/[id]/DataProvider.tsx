import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import Container from "./Container"
import { fetchInquiry } from "../api"

interface IProps {
  pageId: string
}

export default function DataProvider({ pageId }: IProps) {
  const inquiryId = Number(pageId)

  // const prefetchData = async () => {
  //   const queryClient = GetQueryClient()
  //   await queryClient.prefetchQuery(["inquiries"], () =>
  //     fetchInquiry(inquiryId),
  //   )
  //   const dehydratedState = dehydrate(queryClient)

  //   return dehydratedState
  // }
  return (
    // <Hydrate state={prefetchData}>
    <Container inquiryId={inquiryId} />
    // </Hydrate>
  )
}
