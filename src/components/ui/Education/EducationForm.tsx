"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import Link from "next/link"
import * as yup from "yup"
import React from "react"
import RegionSelect from "@/components/common/RegionSelect"

interface Props {
  type: "create" | "update"
}

const schema = yup
  .object({
    image_url: yup
      .string()
      .url("유효한 url 주소를 입력해주세요.")
      .required("채용 기관 주소는 필수입니다."),
  })
  .required()
type FormData = yup.InferType<typeof schema>

const EducationForm = ({ type }: Props) => {
  return (
    <div
      className="mx-auto max-w-screen-lg px-4 lg:px-0"
      style={{
        height: "calc(100vh - 58px)",
      }}
    >
      <div className="relative mt-6">
        <Link href="/jobs">
          <IconButton
            ripple={false}
            variant="text"
            size="md"
            className="absolute -top-1 text-black md:hidden"
          >
            <XMarkIcon className="w-6" />
          </IconButton>
        </Link>
        <h2 className="text-2xl font-bold text-center md:text-left">
          {type === "create" ? "레슨등록" : "레슨수정"}
        </h2>
      </div>
      <RegionSelect />
    </div>
  )
}

export default EducationForm
