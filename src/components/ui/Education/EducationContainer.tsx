"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useDidUpdate } from "@toss/react"
import { LESSON } from "@/types/types"
import { getLessonList, getLessons } from "@/apis/lesson"
import { useInView } from "react-intersection-observer"
import LessonSkeleton from "@/components/ui/Skeleton/LessonSkeleton"
import { fetchProfile } from "@/app/Api"
import { getUser } from "@/apis/user"
import { RegionData } from "@/lib/regions"
import FilterTag from "@/components/common/FilterTag"
import RegionSelect from "@/components/common/RegionSelect"
import MajorSelect from "@/components/common/MajorSelect"
import { useRouter, useSearchParams } from "next/navigation"
import EducationSearchForm from "./EducationSearchForm"
import { ChipButton } from "../Button/LinkChipButton"
import LessonCard from "./LessonCard"
import { useAuth } from "../Auth/AuthProvider"

const EducationContainer = () => {
  const searchParams = useSearchParams()
  const majors = searchParams.get("majors")
  const regions = searchParams.get("regions")
  const initialRegionList = regions ? regions.split(",") : []
  const initialMajorList = majors ? majors.split(",") : []
  const router = useRouter()
  const [isTeacher, setIsTeacher] = useState<boolean>(false)
  const [userLessonId, setUserLessonId] = useState<number>()
  const [isRegionSelect, setIsRegionSelect] = useState(false)
  const [isMajorSelect, setIsMajorSelect] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRegionList, setSelectedRegionList] =
    useState<string[]>(initialRegionList)
  const [selectedMajorList, setSelectedMajorList] =
    useState<string[]>(initialMajorList)
  const [selectedRegionStep, setSelectedRegionStep] = useState(1)
  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

  const { user } = useAuth()

  const handleRegionModal = () => {
    setIsRegionSelect(!isRegionSelect)
  }

  const handleMajorModal = () => {
    setIsMajorSelect(!isMajorSelect)
  }

  const handleSelectCity = (region: string) => {
    setSelectedCity(region)
    setIsRegionSelect(!isRegionSelect)
  }

  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district)
    setIsRegionSelect(false)
  }

  const deleteRegion = (index: number) => {
    setSelectedRegionList(selectedRegionList.filter((_, i) => i !== index))
  }

  const deleteMajor = (index: number) => {
    setSelectedMajorList(selectedMajorList.filter((_, i) => i !== index))
  }

  const handleRegionList = () => {
    const regionList = selectedRegionList.concat(selectedCity).join(",")
    setSelectedRegionList([...selectedRegionList, selectedCity])
    router.push(
      `/educations?regions=${regionList}${majors ? `&majors=${majors}` : ""}`,
    )
    setSelectedRegionStep(1)
  }

  const handleMajorList = () => {
    const majorList = selectedMajorList.concat(selectedMajor).join(",")
    setSelectedMajorList([...selectedMajorList, selectedMajor])
    router.push(
      `/educations?majors=${majorList}${regions ? `&regions=${regions}` : ""}`,
    )
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setIsMajorSelect(false)
  }

  const districtList = useMemo(() => {
    if (selectedCity) {
      return RegionData[selectedCity]
    }
    return null
  }, [selectedCity])

  useEffect(() => {
    if (selectedCity) {
      handleRegionList()
      setSelectedCity("")
    }
  }, [selectedCity])

  useEffect(() => {
    if (selectedMajor) {
      handleMajorList()
      setSelectedMajor("")
    }
  }, [selectedMajor])

  useEffect(() => {
    if (user) {
      fetchProfile(user.id)
        .then(res => setIsTeacher(res[0].is_teacher))
        .catch(err => {
          console.log(err)
        })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      getUser(user.id)
        .then((res: any) => setUserLessonId(res.lessonId))
        .catch(err => console.log("err", err))
    }
  }, [isTeacher])

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } =
    useInfiniteQuery(
      ["lessons", selectedRegionList, selectedMajorList],
      ({ pageParam = 0 }) => {
        return getLessons(pageParam, selectedRegionList, selectedMajorList)
      },
      {
        getNextPageParam: lastPage => {
          if (!lastPage.isLast) return lastPage.nextPage
          return null
        },
      },
    )

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  return (
    <div className="sm:container mx-auto pt-4 px-4">
      <div className="flex justify-between mt-4">
        <div className="flex">
          <h2 className="text-2xl font-bold mb-4">레슨</h2>
          <EducationSearchForm
            handleRegionModal={handleRegionModal}
            handleMajorModal={handleMajorModal}
          />
        </div>

        {isTeacher ? (
          <ChipButton
            url={`/educations/${userLessonId}?type=update`}
            title="레슨수정"
          />
        ) : (
          <ChipButton url="/educations/create" title="레슨등록" />
        )}
      </div>
      <div className=" mb-2">
        <div className="flex mb-1">
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
        <div className="flex overflow-x-autoflex">
          {selectedRegionList.map((region, index) => (
            <FilterTag
              key={region}
              tag={region}
              color="red"
              index={index}
              deleteItem={deleteRegion}
            />
          ))}
        </div>
      </div>
      {isRegionSelect && (
        <RegionSelect
          isOpen={isRegionSelect}
          selectedCity={selectedCity}
          closeModal={() => {
            setIsRegionSelect(false)
            setSelectedRegionStep(1)
          }}
          handleSelectCity={handleSelectCity}
          districtList={districtList}
          selectStep={selectedRegionStep}
          handleSelectDistrict={handleSelectDistrict}
        />
      )}
      {isMajorSelect && (
        <MajorSelect
          isOpen={isMajorSelect}
          closeModal={() => setIsMajorSelect(false)}
          handleSelectMajor={handleSelectMajor}
        />
      )}
      <div id="top" className="h-full pb-8 md:pb-0 ">
        {data?.pages[0]?.lessons.length === 0 && (
          <div className="h-[500px] flex items-center justify-center">
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

        <div className="grid grid-cols-2 gap-6 md:grid-cols-5 mb-10 md:mb-0">
          {data?.pages.map(
            page =>
              page?.lessons.map((lesson: LESSON, index: number) => (
                <Link
                  key={lesson.id}
                  href={`/educations/${lesson.id}`}
                  prefetch={false}
                >
                  <LessonCard
                    lesson={lesson}
                    isLastPage={
                      !(hasNextPage && page.lessons.length - 19 === index)
                    }
                    ref={ref}
                  />
                </Link>
              )),
          )}
        </div>
      </div>
    </div>
  )
}

export default EducationContainer
