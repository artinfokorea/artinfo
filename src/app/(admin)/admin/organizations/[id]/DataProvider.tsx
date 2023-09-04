import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { fetchOrganization } from "@/app/(admin)/admin/organizations/api"
import Container from "./Container"

interface IProps {
  pageId: string
}

export default function DataProvider({ pageId }: IProps) {
  const organizationId = Number(pageId)

  // const prefetchData = async () => {
  //   const queryClient = GetQueryClient()
  //   await queryClient.prefetchQuery(["organizations"], () =>
  //     fetchOrganization(organizationId),
  //   )
  //   const dehydratedState = dehydrate(queryClient)

  //   return dehydratedState
  // }
  return (
    // <Hydrate state={prefetchData}>
    <Container organizationId={organizationId} />
    // </Hydrate>
  )
}
