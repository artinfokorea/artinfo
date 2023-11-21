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
import { useSearchParams } from "next/navigation"
import LessonCard from "./LessonCard"

interface Props {
  selectedMajorList: string[]
  selectedRegionList: string[]
}

const EducationContainer = ({
  selectedMajorList,
  selectedRegionList,
}: Props) => {
  const [category, setCategory] = useState("ALL")
  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })
  useScrollDirection()

  // const getLessons = async (
  //   pageParam: number,
  // ): Promise<{ lessons: LESSON[]; nextPage: number; isLast: boolean }> => {
  //   const response = await fetchLessons({ pageParam })

  //   return {
  //     lessons: response.lessons,
  //     nextPage: pageParam + 1,
  //     isLast: (response.count as number) < 12,
  //   }
  // }

  const fetchLessons = async (
    pageParam: number,
  ): Promise<{ lessons: LESSON[]; nextPage: number; isLast: boolean }> => {
    const response = await getLessonList({
      page: pageParam,
      location: selectedRegionList,
      subjects: selectedMajorList,
    })
    console.log("response", response)

    return {
      lessons: response,
      nextPage: pageParam + 1,
      isLast: response.length < 12,
    }
  }

  // useEffect(() => {
  //   getLessonList({
  //     page: 1,
  //     location: selectedRegionList,
  //     subjects: selectedMajorList,
  //   })
  //     .then(res => res)
  //     .then(res => console.log("res", res))
  // }, [selectedRegionList, selectedMajorList])

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery(
    ["lessons", selectedRegionList, selectedMajorList],
    ({ pageParam = 0 }) => {
      return fetchLessons(pageParam)
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

  return (
    <div id="top" className="">
      {data?.pages[0]?.lessons.length === 0 && (
        <div className="h-full flex items-center justify-center">
          <p className="opacity-70">데이터가 없습니다.</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 px-2">
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
          <LessonSkeleton />
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
        {data?.pages.map(
          page =>
            page?.lessons.map((lesson: any) => (
              <Link
                key={lesson.id}
                href={`/educations/${lesson.id}`}
                prefetch={false}
              >
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
