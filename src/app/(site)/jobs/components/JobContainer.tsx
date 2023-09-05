"use client"

import SelectMenu from "@/components/ui/SelectMenu"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { useDidUpdate } from "@toss/react"
import {
  JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  JOB_POSITION_1DEPTH_CATEGORY,
  Job,
} from "@/types/types"
import Link from "next/link"
import { fetchJobs } from "@/app/Api"
import { isMobileWeb } from "@toss/utils"
import ScrollUpButton from "@/components/ui/Button/ScrollUpButton"
import JobCard from "./JobCard"
import JobSkeleton from "./JobSkeleton"

export default function JobContainer() {
  const [isMounted, setIsMounted] = useState(false)
  const items = [
    { title: "전체", value: "ALL" },
    ...JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  ]

  const [category, setCategory] = useState<
    "ALL" | JOB_POSITION_1DEPTH_CATEGORY
  >("ALL")

  const isMobile = isMobileWeb()

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.5,
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getJobs = async (
    category: "ALL" | JOB_POSITION_1DEPTH_CATEGORY,
    pageParam: number,
  ): Promise<any> => {
    const response = await fetchJobs(category, pageParam)
    return {
      jobs: response,
      nextPage: pageParam + 1,
      isLast: response.length < 10,
    }
  }

  const {
    isLoading,
    isFetching,
    isError,
    error,
    data,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["recruit_jobs", category],
    ({ pageParam = 1 }) => {
      return getJobs(category, pageParam)
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
      console.log("next")
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const updatedPosition1depth = (
    value: "ALL" | JOB_POSITION_1DEPTH_CATEGORY,
  ) => {
    setCategory(value)
  }

  const position1depthItem = items.find(item => item.value === category)

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
      <div className="mb-5 bg-white">
        <SelectMenu
          label="단체별"
          items={items}
          selectedItem={position1depthItem!}
          updateItem={updatedPosition1depth}
        />
      </div>
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
          <JobSkeleton />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {data?.pages?.map(
          group =>
            group?.jobs?.map((item: Job) => (
              <Link key={item.id} href={`/jobs/${item.id}`}>
                <JobCard job={item as any} />
              </Link>
            )),
        )}
        {data?.pages[0].jobs?.length === 0 && <div>데이터가 없습니다.</div>}
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
