"use client"

import React, { useEffect, useState } from "react"
import { fetchLessons } from "@/app/Api"
import { useInfiniteQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useDidUpdate } from "@toss/react"
import { LESSON } from "@/types/types"
import { getLessonList } from "@/apis/lesson"
import useScrollDirection from "@/hooks/useScrollDirection"
import { useInView } from "react-intersection-observer"
import LessonCard from "./LessonCard"

const EducationContainer = () => {
  const [category, setCategory] = useState("ALL")
  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })
  useScrollDirection()

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

  // const fetchLessons = async (
  //   pageParam: number,
  // ): Promise<{ lessons: LESSON[]; nextPage: number; isLast: boolean }> => {
  //   const response = await getLessons()

  //   return {
  //     lessons: response.lessons,
  //     nextPage: 5,
  //     isLast: 5,
  //   }
  // }

  // useEffect(() => {
  //   getLessonList()
  //     .then(res => res)
  //     .then(res => console.log("res", res))
  // }, [])

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
    <div id="top" className="">
      {data?.pages[0]?.lessons.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="opacity-70">데이터가 없습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
        {data?.pages.map(
          page =>
            page?.lessons.map((lesson: any) => (
              <Link key={lesson.id} href={`/educations/${lesson.id}`}>
                <LessonCard lesson={lesson} />
              </Link>
            )),
        )}
      </div>

      <div ref={ref} />
    </div>
  )
}

export default EducationContainer
