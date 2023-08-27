import { useInfiniteQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useInView } from "react-intersection-observer"

interface IProps {
  api: (pageParam: any) => Promise<any>
  queryString: string[]
}

export const useInfiniteQueryWithObservation = ({
  api,
  queryString,
}: IProps) => {
  const { ref, inView } = useInView()

  const { data, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    [...queryString],
    api,
    {
      getNextPageParam: lastPage => lastPage.nextPage,
    },
  )

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  return {
    data: data?.pages,
    status,
    fetchNextPage,
  }
}
