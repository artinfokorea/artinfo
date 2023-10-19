"use client"

import React, { useState } from "react"
import Image from "next/image"
import { DEGREE, DEGREE_VALUES, LESSON } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"
import uuid from "react-uuid"
import dynamic from "next/dynamic"
import { fetchLesson } from "@/app/Api"
import useFilters from "@/hooks/useFilters"
import LocationTag from "@/components/common/LocationTag"
import { clipboard, isMobileWeb } from "@toss/utils"
import useToast from "@/hooks/useToast"
import { useRouter } from "next/navigation"

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
  const { successToast } = useToast()
  const isMobile = isMobileWeb()
  const router = useRouter()

  const { data: lesson } = useQuery<LESSON>({
    queryKey: ["lesson", pageId],
    suspense: true,
    queryFn: () => fetchLesson(Number(pageId)),
  })
  console.log("lesson", lesson)

  const copyToPhone = async () => {
    const isSuccess = await clipboard.writeText(lesson?.phone as string)

    if (isSuccess) {
      successToast("연락처가 복사되었습니다.")
    }
  }

  return (
    <div className="sm:container mx-auto mt-4 ">
      <div className="flex flex-col md:flex-row mt-20">
        <div className="relative w-full  h-[300px] md:w-[300px] md:h-[300px] ">
          <Image
            src={lesson?.image_url || "/public/img/placeholder_user.png"}
            fill
            alt="profile_img"
            sizes="(max-width: 1200px) 220px, 100px"
            priority
            className="px-10 md:px-0"
          />
        </div>
        <div className="flex flex-col mt-6 mx-6  md:my-2">
          <div className="text-xl font-semibold ">{lesson?.name}</div>
          <div className="flex flex-col my-4">
            <span className="text-lg font-medium opacity-60 my-2">
              레슨 가능 지역
            </span>
            <ul>
              {lesson?.locations.map(location => (
                <li key={location} className="text-sm font-semibold opacity-80">
                  {location}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col my-4">
            <span className="text-lg font-medium opacity-60 my-2">전공</span>
            <ul className="flex flex-row ">
              {lesson?.subjects.map(subject => (
                <li key={subject} className="font-semibold text-sm">
                  <LocationTag key={subject} tag={subject} />
                </li>
              ))}
            </ul>
          </div>
          <div className="font-semibold text-lg flex my-4">
            <span className="text-lg font-medium opacity-60 mr-2">가격</span>
            <span className="mr-2">시간당</span>
            <span>{filters.FEECOMMA(lesson?.fee as number)}원</span>
          </div>
        </div>
        <div className="flex flex-col mx-6">
          <div className="flex my-2">
            <span className="text-lg font-medium opacity-60 mr-4">학력</span>
            <ul>
              {lesson?.degree.map((deg, index) => (
                <li key={uuid()} className="mt-1">
                  {Object.entries(deg).map(([key, value]) => (
                    <span key={key}>
                      {value} - {DEGREE_VALUES[key as DEGREE]}
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
      <div className="m-2 flex flex-col mx-6">
        <span className="text-lg font-medium opacity-60">전문가 소개</span>
        <p className="my-4">{lesson?.intro}</p>
      </div>
      {!isMobile && (
        <div className="mt-40 text-white mb-4 ">
          <button
            className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50 mr-2"
            onClick={() => router.replace("/educations")}
          >
            뒤로가기
          </button>
        </div>
      )}
      {isMobile && (
        <div className="fixed bottom-32 right-3">
          <ListButton list="educations" />
        </div>
      )}
    </div>
  )
}

export default EducationDetailContainer
