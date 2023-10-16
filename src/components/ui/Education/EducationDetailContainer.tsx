"use client"

import React from "react"
import Image from "next/image"
import { LESSON } from "@/types/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
      <div className="relative w-[300px] h-[400px]">
        <Image
          src={lesson?.image_url}
          fill
          alt="profile_img"
          sizes="(max-width: 1200px) 220px, 100px"
          priority
        />
      </div>
    </div>
  )
}

export default EducationDetailContainer
