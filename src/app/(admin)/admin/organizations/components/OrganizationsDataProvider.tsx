import { Hydrate, dehydrate } from "@tanstack/react-query"
import GetQueryClient from "@/app/GetQueryClient"
import { fetchOrganizations } from "../api"
import OrganizationList from "./OrganizationList"

export default function InquiryDataProvider() {
  const prefetchData = async () => {
    "use server"

    const queryClient = GetQueryClient()

    await queryClient.prefetchQuery({
      queryKey: ["organizations"],
      queryFn: () => fetchOrganizations(1),
    })
    const dehydratedState = dehydrate(queryClient)
    return dehydratedState
  }

  return (
    <Hydrate state={prefetchData}>
      <OrganizationList />
    </Hydrate>
  )
}
