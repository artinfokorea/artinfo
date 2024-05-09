"use client"

import React, { useState } from "react"
import { clipboard } from "@toss/utils"
import useToast from "@/hooks/useToast"
import { LESSON } from "@/types/types"
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"

interface Props {
  lesson: LESSON
}

const EducationPhoneTag = ({ lesson }: Props) => {
  const [isPhoneShow, setIsPhoneShow] = useState(false)
  const { successToast } = useToast()

  const copyToPhone = async () => {
    const isSuccess = await clipboard.writeText(lesson?.phone as string)

    if (isSuccess) {
      successToast("연락처가 복사되었습니다.")
    }
  }

  return (
    <div className="my-4 flex ">
      <span className="text-lg font-medium opacity-60">연락처</span>
      {isPhoneShow ? (
        <div className="flex items-center font-medium text-lg ml-4">
          <span>{lesson?.phone}</span>
          <button onClick={copyToPhone}>
            <ClipboardDocumentListIcon className="w-4 pb-1 ml-2" />
          </button>
        </div>
      ) : (
        <button
          className="text-blue-500 font-semibold text-lg ml-4"
          onClick={() => setIsPhoneShow(!isPhoneShow)}
        >
          연락처보기
        </button>
      )}
    </div>
  )

  //   ( {isPhoneShow ? (
  //     <div className="flex items-center font-medium text-lg ml-4">
  //       <span>{lesson?.phone}</span>
  //       <button onClick={copyToPhone}>
  //         <ClipboardDocumentListIcon className="w-4 pb-1 ml-2" />
  //       </button>
  //     </div>
  //   ) : (
  //     <button
  //       className="text-blue-500 font-semibold text-lg ml-4"
  //       onClick={() => setIsPhoneShow(!isPhoneShow)}
  //     >
  //       연락처보기
  //     </button>
  //   )})
}

export default EducationPhoneTag
