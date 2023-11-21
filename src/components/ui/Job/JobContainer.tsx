"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { useDidUpdate } from "@toss/react"
import { JOB_POSITION_1DEPTH_CATEGORY, Job } from "@/types/types"
import Link from "next/link"
import { fetchJobs } from "@/app/Api"
import useScrollDirection from "@/hooks/useScrollDirection"
import JobCategory from "@/components/ui/Job/JobCategory"
import JobCard from "./JobCard"
import JobSkeleton from "../Skeleton/JobSkeleton"

export default function JobContainer() {
  const [isMounted, setIsMounted] = useState(false)
  const [category, setCategory] = useState<
    "ALL" | JOB_POSITION_1DEPTH_CATEGORY
  >("ALL")
  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.5,
  })

  useScrollDirection()

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
      suspense: false,
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

  return (
    <div id="top">
      <div>
        <div className="mb-4 flex align-center justify-between">
          <JobCategory
            category={category}
            updatedCategory={updatedPosition1depth}
          />
        </div>
      </div>
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4">
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4 ">
        {data?.pages?.map(
          group =>
            group?.jobs?.map((item: Job) => (
              <Link key={item.id} href={`/jobs/${item.id}`} prefetch={false}>
                <JobCard job={item as any} />
              </Link>
            )),
        )}
        {data?.pages[0].jobs?.length === 0 && <div>데이터가 없습니다.</div>}
      </div>
      {/* {isMounted && isMobile && (
        <div className="fixed bottom-32 right-3">
          <ScrollUpButton handleScroll={handleScroll} />
        </div>
      )} */}
      <div ref={ref} />
    </div>
  )
}
