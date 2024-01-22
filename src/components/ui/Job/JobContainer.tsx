"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { useDidUpdate } from "@toss/react"
import { Job } from "@/types/types"
import Link from "next/link"
import { getJobList } from "@/apis/job"
import JobMajorSelect from "@/components/common/JobMajorSelect"
import FilterTag from "@/components/common/FilterTag"
import JobCard from "./JobCard"
import JobSkeleton from "../Skeleton/JobSkeleton"

interface Props {
  isMajorSelect: boolean
  handleMajorModal: () => void
}

export default function JobContainer({
  handleMajorModal,
  isMajorSelect,
}: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>([])

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.5,
  })

  const deleteMajor = (index: number) => {
    setSelectedMajorList(selectedMajorList.filter((_, i) => i !== index))
  }

  const handleMajorList = () => {
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

  // useScrollDirection()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getJobs = async (
    pageParam: number,
    selectedMajorList: string[],
  ): Promise<any> => {
    const response = await getJobList({
      page: pageParam,
      major: selectedMajorList,
    })
    return {
      jobs: response,
      nextPage: pageParam + 1,
      isLast: response.length < 20,
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
      suspense: false,
    },
  )

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
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
            group?.jobs?.map((item: Job) => (
              <Link key={item.id} href={`/jobs/${item.id}`} prefetch={false}>
                <JobCard job={item} />
              </Link>
            )),
        )}
      </div>
      {data?.pages[0].jobs?.length === 0 && (
        <div className="w-full flex justify-center h-[500px] items-center">
          <span>데이터가 없습니다.</span>
        </div>
      )}
      {/* {isMounted && isMobile && (
        <div className="fixed bottom-32 right-3">
          <ScrollUpButton handleScroll={handleScroll} />
        </div>
      )} */}
      <div ref={ref} className="h-12" />

      {isMajorSelect && (
        <JobMajorSelect
          isOpen={isMajorSelect}
          closeModal={handleMajorModal}
          handleSelectMajor={handleSelectMajor}
        />
      )}
    </div>
  )
}
