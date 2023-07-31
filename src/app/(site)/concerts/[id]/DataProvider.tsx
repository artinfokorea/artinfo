import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"

import { fetchConcert } from "@/app/Api"
import Container from "./Container"

interface IProps {
  pageId: string
}

export default async function DataProvider({ pageId }: IProps) {
  const id = Number(pageId)

  const queryClient = GetQueryClient()
  await queryClient.prefetchQuery(["concert", id], () => fetchConcert(id))
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      <Container pageId={id} />
    </Hydrate>
  )
}
