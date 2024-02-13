"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { useDidUpdate } from "@toss/react"
import { Job } from "@/types/types"
import Link from "next/link"
import { getJobs } from "@/apis/job"
import JobMajorSelect from "@/components/common/JobMajorSelect"
import FilterTag from "@/components/common/FilterTag"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import { useRouter, useSearchParams } from "next/navigation"
import JobCard from "./JobCard"
import JobSkeleton from "../Skeleton/JobSkeleton"

export default function JobContainer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const majors = searchParams.get("majors")
  const initialSelectedMajorList = majors ? majors.split(",") : []
  const [isMajorSelect, setIsMajorSelect] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>(
    initialSelectedMajorList,
  )

  const handleMajorModal = () => setIsMajorSelect(!isMajorSelect)

  const [ref, inView] = useInView({
    delay: 100,
    threshold: 1,
  })

  const deleteMajor = (index: number) => {
    const majorList = selectedMajorList.filter((_, i) => i !== index)
    router.push(`/jobs?majors=${majorList}`)
    setSelectedMajorList(majorList)
  }

  const handleMajorList = () => {
    const majorList = selectedMajorList.concat(selectedMajor).join(",")
    router.push(`/jobs?majors=${majorList}`)
    setSelectedMajorList([...selectedMajorList, selectedMajor])
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    handleMajorModal()
  }

  useEffect(() => {
    if (selectedMajor) {
      handleMajorList()
      setSelectedMajor("")
    }
  }, [selectedMajor])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["recruit_jobs", selectedMajorList],
    ({ pageParam = 1 }) => {
      return getJobs(pageParam, selectedMajorList)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      suspense: true,
    },
  )

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <div className="sm:container mx-auto pt-4 px-4 ">
      <div className="flex justify-between mt-4">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">채용</h2>
          <button
            onClick={handleMajorModal}
            className="flex ml-4 items-center rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400
          "
          >
            <span>전공 검색</span>
          </button>
        </div>
        <ChipButton url="/jobs/create" title="채용등록" />
      </div>
      <div id="top">
        <div className="mb-2">
          <div className="flex ml-2">
            {selectedMajorList.map((major, index) => (
              <FilterTag
                key={major}
                tag={major}
                color="blue"
                index={index}
                deleteItem={deleteMajor}
              />
            ))}
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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  gap-4 mb-20 md:mb-10">
          {data?.pages?.map(
            group =>
              group?.jobs?.map((item: Job, index: number) => (
                <>
                  <Link
                    key={item.id}
                    href={`/jobs/${item.id}`}
                    prefetch={false}
                  >
                    <JobCard job={item} />
                  </Link>
                  {hasNextPage && index === group.jobs.length - 8 && (
                    <div ref={ref} />
                  )}
                </>
              )),
          )}
        </div>
        {data?.pages[0].jobs?.length === 0 && (
          <div className="w-full flex justify-center h-[500px] items-center">
            <span>데이터가 없습니다.</span>
          </div>
        )}

        {isMajorSelect && (
          <JobMajorSelect
            isOpen={isMajorSelect}
            closeModal={handleMajorModal}
            handleSelectMajor={handleSelectMajor}
          />
        )}
      </div>
    </div>
  )
}
