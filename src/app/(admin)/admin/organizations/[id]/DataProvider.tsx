import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import Container from "./Container"
import { fetchInquiry } from "../api"

interface IProps {
  pageId: string
}

export default function DataProvider({ pageId }: IProps) {
  const organizationId = Number(pageId)
  

  const prefetchData = async () => {
    "use server"
    const queryClient = GetQueryClient()
    await queryClient.prefetchQuery(["organizations"], () =>
      fetchInquiry(organizationId),
    )
    const dehydratedState = dehydrate(queryClient)

    return dehydratedState
  }
  return (
    <Hydrate state={prefetchData}>
      <Container organizationId={organizationId} />
    </Hydrate>
  )
}
