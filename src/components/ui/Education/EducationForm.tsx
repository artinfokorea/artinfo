"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import Link from "next/link"
import * as yup from "yup"
import React, { useState, useMemo } from "react"
import RegionSelect from "@/components/common/RegionSelect"
import { RegionData } from "@/lib/regions"

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
  const [isRegionSelect, setIsRegionSelect] = useState(false)
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectStep, setSelectStep] = useState(1)

  const handleSelectCity = (region: string) => {
    setSelectedCity(region)
    setSelectStep(2)
  }

  const handleSelectDistrict = (district: string) => {
    setSelectedDistrict(district)
    setIsRegionSelect(false)
  }

  const districtList = useMemo(() => {
    if (selectedCity) {
      return RegionData[selectedCity]
    }
    return null
  }, [selectedCity])

  const selectedRegionList = useMemo(() => {
    const list = []
    if (selectedDistrict) {
      const district = `${selectedCity} ${selectedDistrict}`
      list.push(district)
    }
    return list
  }, [selectedDistrict])

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
            className=" text-black md:hidden"
          >
            <XMarkIcon className="w-6" />
          </IconButton>
        </Link>
        <h2 className="text-2xl font-bold text-center md:text-left">
          {type === "create" ? "레슨등록" : "레슨수정"}
        </h2>
      </div>
      <div className="mt-2 flex items-center">
        {selectedRegionList.map(region => (
          <span key={region}>{region}</span>
        ))}
      </div>
      <button
        onClick={() => setIsRegionSelect(true)}
        className="rounded-md bg-blue1  p-2 text-xs font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        지역 추가
      </button>

      {isRegionSelect && (
        <RegionSelect
          isOpen={isRegionSelect}
          selectedCity={selectedCity}
          closeModal={() => setIsRegionSelect(false)}
          handleSelectCity={handleSelectCity}
          districtList={districtList}
          selectStep={selectStep}
          handleSelectDistrict={handleSelectDistrict}
        />
      )}
    </div>
  )
}

export default EducationForm
