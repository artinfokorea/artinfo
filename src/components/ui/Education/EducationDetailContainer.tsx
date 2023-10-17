"use client"

import React from "react"
import Image from "next/image"
import { LESSON } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import uuid from "react-uuid"
import { fetchLesson } from "@/app/Api"

interface Props {
  pageId: string
}

const EducationDetailContainer = ({ pageId }: Props) => {
  const { data: lesson } = useQuery<LESSON>({
    queryKey: ["lesson", pageId],
    suspense: true,
    queryFn: () => fetchLesson(Number(pageId)),
  })
  console.log("lesson", lesson)
  return (
    <div className="sm:container mx-auto mt-4">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full  h-[500px] md:w-[400px]">
          <Image
            src={lesson?.image_url || "/public/img/placeholder_user.png"}
            fill
            alt="profile_img"
            sizes="(max-width: 1200px) 220px, 100px"
            priority
            className="px-4"
          />
        </div>
        <div className="flex flex-col m-2 bg-blue">
          <div className="text-xl font-semibold text-center my-4">
            {lesson?.name}
          </div>
          <div className="flex">
            <span>레슨 가능 지역</span>
            <ul>
              {lesson?.locations.map(location => (
                <li key={location}>{location}</li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <span>전공</span>
            <ul>
              {lesson?.subjects.map(subject => (
                <li key={subject}>{subject}</li>
              ))}
            </ul>
          </div>
          <div>
            <span>시간당 가격</span>
            <span>{lesson?.fee}</span>
          </div>
          <div>
            <span>연락처</span>
            <span>{lesson?.phone}</span>
          </div>
        </div>
      </div>
      <div>
        <span>학력</span>
        <ul>
          {lesson?.degree.map((deg, index) => (
            <li key={uuid()}>
              {Object.entries(deg).map(([key, value]) => (
                <span key={key}>{value}</span>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EducationDetailContainer
