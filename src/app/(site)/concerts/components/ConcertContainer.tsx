"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { fetchConcerts } from "@/app/Api"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDidUpdate } from "@toss/react"
import { isMobileWeb } from "@toss/utils"
import { useInView } from "react-intersection-observer"
import { CONCERT_CATEGORY } from "@/types/types"
import ScrollUpButton from "@/components/ui/Button/ScrollUpButton"
import useAuth from "@/hooks/useAuth"
import ConcertCard from "../../../../components/ui/Card/ConcertCard"
import ConcertCategory from "./ConcertCategory"
import ConcertSkeleton from "../../../../components/ui/Skeleton/ConcertSkeleton"

export default function ConcertContainer() {
  const [category, selectCategory] = useState<"ALL" | CONCERT_CATEGORY>("ALL")
  const [isMounted, setIsMounted] = useState(false)
  const isMobile = isMobileWeb()
  const auth = useAuth()

  const getConcerts = async (
    category: "ALL" | CONCERT_CATEGORY,
    pageParam: number,
  ): Promise<any> => {
    const response = await fetchConcerts(pageParam, category)
    return {
      concerts: response,
      nextPage: pageParam + 1,
      isLast: response.length < 12,
    }
  }

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["concerts", category],
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

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const updatedCategory = (_category: "ALL" | CONCERT_CATEGORY) => {
    selectCategory(_category)
  }

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  return (
    <div id="top">
      <div className="mb-4 flex align-center justify-between">
        <ConcertCategory
          category={category}
          updatedCategory={updatedCategory}
        />
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
        </div>
      )}

      <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-4">
        {data?.pages.map(
          page =>
            page?.concerts?.map((concert: any) => (
              <Link key={concert.id} href={`/concerts/${concert.id}`}>
                <ConcertCard item={concert} />
              </Link>
            )),
        )}
      </div>

      {isMounted && isMobile && (
        <div className="fixed bottom-32 right-3">
          <ScrollUpButton handleScroll={handleScroll} />
        </div>
      )}
      <div ref={ref} />
    </div>
  )
}
