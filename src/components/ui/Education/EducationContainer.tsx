"use client"

import React, { useState } from "react"
import { fetchLessons } from "@/app/Api"
import { useInfiniteQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useDidUpdate } from "@toss/react"
import { LESSON } from "@/types/types"
import { useInView } from "react-intersection-observer"
import LessonCard from "./LessonCard"
import LessonSkeleton from "../Skeleton/LessonSkeleton"

const EducationContainer = () => {
  const [category, setCategory] = useState("ALL")

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

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

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
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

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <div id="top" className="h-screen">
      {isLoading && (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 px-2">
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
        </div>
      )}

      {data?.pages[0]?.lessons.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="opacity-70">데이터가 없습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-5 px-2">
        {data?.pages.map(
          page =>
            page?.lessons.map((lesson: any) => (
              <Link key={lesson.id} href={`/educations/${lesson.id}`}>
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
      <div ref={ref} />
    </div>
  )
}

export default EducationContainer
