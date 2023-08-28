"use client"

import { useState } from "react"
import Link from "next/link"
import { fetchConcerts } from "@/app/Api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDidUpdate } from "@toss/react"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import { useInView } from "react-intersection-observer"
import { CONCERT_CATEGORY } from "@/types/types"
import ConcertCard from "./ConcertCard"
import ConcertCategory from "./ConcertCategory"

export default function ConcertContainer() {
  const [category, selectCategory] = useState<"ALL" | CONCERT_CATEGORY>("ALL")

  // const { data } = useQuery({
  //   queryKey: ["concerts", category],
  //   suspense: false,
  //   queryFn: () => fetchConcerts(category === "ALL" ? undefined : category),
  // })

  const getConcerts = async (
    category: "ALL" | CONCERT_CATEGORY,
    pageParam: number,
  ): Promise<any> => {
    const response = await fetchConcerts(pageParam, category)
    return {
      concerts: response,
      nextPage: pageParam + 1,
      isLast: response.length < 10,
    }
  }

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.3,
  })

  const {
    isLoading,
    isFetching,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["jobs", category],
    ({ pageParam = 1 }) => {
      return getConcerts(category, pageParam)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  )
  console.log("data", data)
  useDidUpdate(() => {
    console.log("inView", inView)
    console.log("hasNextPage", hasNextPage)
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  if (isLoading) return <div> ...loading</div>

  const updatedCategory = (_category: "ALL" | CONCERT_CATEGORY) => {
    selectCategory(_category)
  }

  return (
    <div>
      <div className="mb-4 flex align-center justify-between">
        <ConcertCategory
          category={category}
          updatedCategory={updatedCategory}
        />
        <ChipButton url="/concerts/create" title="공연등록" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.pages.map(
          page =>
            page?.concerts?.map((concert: any) => (
              <Link key={concert.id} href={`/concerts/${concert.id}`}>
                <ConcertCard item={concert} />
              </Link>
            )),
        )}
      </div>
      <div ref={ref} />
    </div>
  )
}
