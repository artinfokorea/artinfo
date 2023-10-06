"use client"

import React, { useState } from "react"
import { fetchLessons } from "@/app/Api"
import { useInfiniteQuery } from "@tanstack/react-query"
import Link from "next/link"
import Loading from "@/components/common/Loading"
import { LESSON } from "@/types/types"
import LessonCard from "./LessonCard"
import StudioCard from "./StudioCard"

const EducationContainer = () => {
  const [category, setCategory] = useState("ALL")

  const getLessons = async (
    pageParam: number,
  ): Promise<{ lessons: LESSON[]; nextPage: number; isLast: boolean }> => {
    const response = await fetchLessons({ pageParam })

    return {
      lessons: response.lessons,
      nextPage: pageParam + 1,
      isLast: (response.count as number) < 12,
    }
  }

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["lessons"],
    ({ pageParam = 0 }) => {
      return getLessons(pageParam)
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

  const items = [1, 2, 3, 4, 5, 6, 7, 8]

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {data?.pages.map(
          page =>
            page?.lessons.map((lesson: any) => (
              <Link key={lesson.id} href={`/concerts/${lesson.id}`}>
                <LessonCard lesson={lesson} />
              </Link>
            )),
        )}
      </div>

      {/* <h1 className="text-xl mt-10 ">레슨</h1>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item, index) => (
          <StudioCard key={item} />
        ))}
      </div> */}
    </div>
  )
}

export default EducationContainer
