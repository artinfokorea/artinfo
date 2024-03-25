"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { DEGREE, DEGREE_VALUES, LESSON } from "@/types/types"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"
import uuid from "react-uuid"
import dynamic from "next/dynamic"
import { deleteLesson, fetchLesson } from "@/app/Api"
import useFilters from "@/hooks/useFilters"
import LocationTag from "@/components/common/LocationTag"
import { clipboard, isMobileWeb } from "@toss/utils"
import useToast from "@/hooks/useToast"
import useAuth from "@/hooks/useAuth"
import { useRouter, useSearchParams } from "next/navigation"
import { getLesson } from "@/apis/lesson"
import EducationForm from "./EducationForm"

const ListButton = dynamic(() => import("@/components/ui/Button/ListButton"), {
  ssr: false,
  loading: () => <div>loading...</div>,
})

interface Props {
  pageId: string
}

const EducationDetailContainer = ({ pageId }: Props) => {
  const filters = useFilters()
  const [isPhoneShow, setIsPhoneShow] = useState(false)
  const { successToast, errorToast } = useToast()
  const isMobile = isMobileWeb()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [pageType, setPageType] = useState("read")
  const params = useSearchParams()
  const typeParam = params.get("type")

  const { data: lesson } = useQuery({
    queryKey: ["lesson", pageId],
    queryFn: () => getLesson(Number(pageId)),
  })

  const copyToPhone = async () => {
    const isSuccess = await clipboard.writeText(lesson?.phone as string)

    if (isSuccess) {
      successToast("연락처가 복사되었습니다.")
    }
  }
  const deleteLessonMutation = useMutation({
    mutationFn: (lessonId: number) => {
      return deleteLesson(lessonId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.replace("/educations")
      queryClient.invalidateQueries(["lessons"])
      successToast("레슨이 삭제되었습니다.")
    },
  })

  const handleDeleteLesson = () => {
    deleteLessonMutation.mutate(Number(pageId))
  }

  useEffect(() => {
    if (typeParam === "update") setPageType("update")
  }, [typeParam])

  return (
    <div className="max-w-screen-lg mx-auto mt-4 pb-40 md:pb-0">
      {pageType === "read" && (
        <>
          <div className="flex flex-col md:flex-row mt-20 mx-5 md:mx-0 ">
            <div className="relative mx-auto md:mx-0 w-[280px] h-[400px] md:w-[320px]">
              <Image
                src={lesson?.imageUrl || "/public/img/placeholder_user.png"}
                fill
                alt="profile_img"
                sizes="(max-width: 1200px) 220px, 100px"
                priority
                quality={100}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col mt-6 mx-3 md:mx-10  md:my-2">
              <div className="text-xl font-semibold mt-2  ">{lesson?.name}</div>
              <div className="flex flex-col my-4">
                <span className="text-lg font-medium opacity-60 my-2">
                  레슨 가능 지역
                </span>
                <ul>
                  {lesson?.locations.map(location => (
                    <li
                      key={location}
                      className="text-sm font-semibold opacity-80"
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col my-4">
                <span className="text-lg font-medium opacity-60 my-2">
                  전공
                </span>
                <ul className="flex flex-row ">
                  {lesson?.majors.map(major => (
                    <li key={major} className="font-semibold text-sm">
                      <LocationTag key={major} tag={major} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="font-semibold text-lg flex my-4">
                <span className="text-lg font-medium opacity-60 mr-2 whitespace-nowrap">
                  가격
                </span>
                <span className="mr-2 whitespace-nowrap">시간당</span>
                <span className="whitespace-nowrap">
                  {filters.FEECOMMA(lesson?.fee as number)}원
                </span>
              </div>
            </div>
            <div className="flex flex-col mx-3 md:mx-7 ">
              <div className="flex mt-5">
                <span className="text-lg font-medium opacity-60 mr-4 leading-6 whitespace-nowrap">
                  학력
                </span>
                <ul>
                  {lesson?.degrees.map((deg: DEGREE) => (
                    <li key={uuid()}>
                      {Object.entries(deg).map(([key, value]) => (
                        <span key={key} className="whitespace-pre-line">
                          {DEGREE_VALUES[key as DEGREE]} - {value}
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="my-4 flex ">
                <span className="text-lg font-medium opacity-60">연락처</span>
                {!isPhoneShow && (
                  <button
                    className="text-blue-500 font-semibold text-lg ml-4"
                    onClick={() => setIsPhoneShow(!isPhoneShow)}
                  >
                    연락처보기
                  </button>
                )}
                {isPhoneShow && (
                  <div className="flex items-center font-medium text-lg ml-4">
                    <span>{lesson?.phone}</span>
                    <button onClick={copyToPhone}>
                      <ClipboardDocumentListIcon className="w-4 pb-1 ml-2" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="my-2 flex flex-col mx-[32px] md:mx-0 md:my-10">
            <span className="text-lg font-medium opacity-60 ">전문가 소개</span>
            <p className="my-4 leading-6 whitespace-pre-line">
              {lesson?.intro}
            </p>
          </div>
          {/* {!isMobile && (
            <div className="sm:container  text-white flex fixed bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full ">
              {lesson?.profile_id === user?.id && (
                <>
                  <button
                    className=" px-3 bg-indigo-600 rounded-l-md"
                    onClick={handleDeleteLesson}
                  >
                    <TrashIcon className="w-9 border-r border-white pr-3" />
                  </button>

                  <button
                    className=" bg-indigo-600"
                    onClick={() => setPageType("update")}
                  >
                    <PencilSquareIcon className="w-9 border-r border-white pr-3" />
                  </button>
                </>
              )}

              <button
                className={`transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600  disabled:opacity-50 mr-2
                ${
                  lesson?.profile_id === user?.id
                    ? "rounded-r-md"
                    : "rounded-md"
                }
                `}
                onClick={() => router.replace("/educations")}
              >
                뒤로가기
              </button>
            </div>
          )} */}
          {isMobile && (
            <div className="fixed bottom-32 right-3">
              <ListButton list="educations" />
            </div>
          )}
        </>
      )}
      {pageType === "update" && <EducationForm type="update" lesson={lesson} />}
    </div>
  )
}

export default EducationDetailContainer
