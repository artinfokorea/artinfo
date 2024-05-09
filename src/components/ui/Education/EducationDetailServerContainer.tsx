import LocationTag from "@/components/common/LocationTag"
import useFilters from "@/hooks/useFilters"
import { PageType } from "@/interface/common"
import { DEGREE, DEGREE_VALUES, LESSON } from "@/types/types"
import React from "react"
import uuid from "react-uuid"
import EducationForm from "./EducationForm"
import EducationPhoneTag from "./EducationPhoneTag"
import MobileListButton from "../Button/MobileListButton"

interface Props {
  lesson: LESSON
  searchParams?: { [key: string]: PageType }
}

const EducationDetailServerContainer = ({ lesson, searchParams }: Props) => {
  const filters = useFilters()
  const pageType = searchParams?.type || PageType.read

  return (
    <div className="max-w-screen-lg mx-auto mt-4 pb-40 md:pb-0">
      {pageType === PageType.read && (
        <>
          <div className="flex flex-col md:flex-row mt-20 mx-5 md:mx-0 ">
            <div className="relative mx-auto md:mx-0 w-[280px] h-[400px] md:w-[320px]">
              <img
                src={lesson?.imageUrl || "/public/img/placeholder_user.png"}
                alt="profile_img"
                className="rounded-md w-full h-full"
              />
            </div>
            <div className="flex flex-col mt-6 mx-2 md:mx-10  md:my-2">
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
              <EducationPhoneTag lesson={lesson} />
            </div>
          </div>
          <div className="my-2 flex flex-col mx-[32px] md:mx-0 md:my-10">
            <span className="text-lg font-medium opacity-60 ">전문가 소개</span>
            <p className="my-4 leading-6 whitespace-pre-line">
              {lesson?.intro}
            </p>
          </div>
          <MobileListButton />
        </>
      )}
      {pageType === PageType.update && (
        <EducationForm type="update" lesson={lesson} />
      )}
    </div>
  )
}

export default EducationDetailServerContainer
