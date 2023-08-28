"use client"

import SelectMenu from "@/components/ui/SelectMenu"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useState } from "react"
import { useDidUpdate } from "@toss/react"
import {
  JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  JOB_POSITION_1DEPTH_CATEGORY,
  Job,
} from "@/types/types"
import Link from "next/link"
import { fetchJobs } from "@/app/Api"
import JobCard from "./JobCard"

export default function JobContainer() {
  const items = [
    { title: "전체", value: "ALL" },
    ...JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  ]

  const [category, setCategory] = useState<
    "ALL" | JOB_POSITION_1DEPTH_CATEGORY
  >("ALL")

  const [page, setPage] = useState(1)

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

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
    ["jobs", category],
    ({ pageParam = 1 }) => {
      return getJobs(category, pageParam)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  )

  // const { data: jobs } = useQuery({
  //   queryKey: ["jobs", category],
  //   suspense: true,
  //   cacheTime: 0,
  //   queryFn: () => fetchJobs(category, page),
  // })

  console.log("data", data)

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const updatedPosition1depth = (
    value: "ALL" | JOB_POSITION_1DEPTH_CATEGORY,
  ) => {
    setCategory(value)
  }
  if (isLoading) return <div>...loading</div>

  const position1depthItem = items.find(item => item.value === category)

  return (
    <div className="">
      <div className="mb-5 bg-white">
        <SelectMenu
          label="단체별"
          items={items}
          selectedItem={position1depthItem!}
          updateItem={updatedPosition1depth}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
        {data?.pages?.map(
          page =>
            page?.jobs?.map((item: Job) => (
              <Link key={item.id} href={`/jobs/${item.id}`}>
                <JobCard job={item as any} />
              </Link>
            )),
        )}
        {data?.pages[0].jobs.length === 0 && <div>데이터가 없습니다.</div>}
      </div>
      <div ref={ref} />
    </div>
  )
}
