"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useDidUpdate } from "@toss/react"
import { useInView } from "react-intersection-observer"
import { CONCERT } from "@/types/types"
import { getConcertKeywords, getConcertLists } from "@/apis/concert"
import ConcertCard from "./ConcertCard"
import ConcertSkeleton from "../Skeleton/ConcertSkeleton"
import { Badge } from "../badge"

export default function ConcertContainer() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")

  // useScrollDirection()

  const getConcerts = async (
    pageParam: number,
    keyword?: string,
  ): Promise<any> => {
    const response = await getConcertLists({
      page: pageParam,
      keyword,
    })
    return {
      concerts: response,
      nextPage: pageParam + 1,
      isLast: response.length < 20,
    }
  }

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

  const { data: keywords } = useQuery({
    queryKey: ["keywords"],
    queryFn: () => getConcertKeywords(5),
    staleTime: 1000 * 60 * 60 * 24,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["concerts", searchKeyword],
    ({ pageParam = 1 }) => {
      return getConcerts(pageParam, searchKeyword)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      suspense: false,
    },
  )

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const handleBagge = (keyword: string) => {
    if (selectedBadge === keyword) {
      setSelectedBadge("")
    } else {
      setSelectedBadge(keyword)
      setSearchInput(keyword)
      setSearchKeyword(keyword)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
    setSelectedBadge("")
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    setSearchKeyword(searchInput)
  }

  const resetInput = () => {
    setSearchInput("")
    setSelectedBadge("")
    setSearchKeyword("")
  }

  return (
    <div id="top">
      <div className="mb-4 flex flex-col">
        <form className="relative" onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchInput}
            className="w-full rounded-3xl h-12 border-none pl-10 outline-none"
            placeholder="공연 키워드를 검색해보세요."
            onChange={handleInput}
          />
          <button onClick={handleSubmit}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              data-slot="icon"
              className="w-6 h-6 absolute left-3 top-3 text-gray-400"
            >
              <path
                fillRule="evenodd"
                d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {searchInput && (
            <button className="absolute right-3 top-3" onClick={resetInput}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </form>
        <div className="mt-4">
          {keywords?.map(keyword => (
            <Badge
              key={keyword}
              className={`cursor-pointer bg-badge text-primary text-sm md:text-lg  ml-2 py-[6px] px-3 my-1 md:my-0 ${
                selectedBadge === keyword
                  ? "border border-royalblue bg-white text-royalblue"
                  : ""
              } `}
              onClick={() => handleBagge(keyword)}
            >
              # {keyword}
            </Badge>
          ))}
        </div>
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
            page?.concerts?.map((concert: CONCERT) => (
              <Link
                key={concert.id}
                href={`/concerts/${concert.id}`}
                prefetch={false}
              >
                <ConcertCard item={concert} />
              </Link>
            )),
        )}
      </div>

      {/* {isMounted && isMobile && (
        <div className="fixed bottom-32 right-3">
          <ScrollUpButton handleScroll={handleScroll} />
        </div>
      )} */}
      <div ref={ref} className="h-12" />
    </div>
  )
}
