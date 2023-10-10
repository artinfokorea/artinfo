"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton, Input, Textarea, Button } from "@/components/material"
import Link from "next/link"
import * as yup from "yup"
import React, { useState, useMemo, useEffect, useRef } from "react"
import RegionSelect from "@/components/common/RegionSelect"
import { RegionData } from "@/lib/regions"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import FileUploader from "@/components/common/FileUploader"
import MajorSelect from "@/components/common/MajorSelect"
import useAuth from "@/hooks/useAuth"
import useToast from "@/hooks/useToast"
import { Toaster } from "react-hot-toast"
import useSupabase from "@/hooks/useSupabase"
import { useQueryClient } from "@tanstack/react-query"

interface Props {
  type: "create" | "update"
}

const schema = yup
  .object({
    phone: yup
      .string()
      .nullable()
      .min(11, "11자리 이상 입력해주세요")
      .required("전화번호는 필수입니다."),
    name: yup
      .string()
      .nullable()
      .min(2, "2자리 이상 실명을 입력해주세요.")
      .required("이름은 실명을 입력해주셔야하며 필수입니다."),
    fee: yup.number().nullable().required("수업료는 필수입니다."),
    intro: yup
      .string()
      .nullable()
      .min(10, "10글자 이상 입력해주세요.")
      .max(1000, "1000자 이내로 입력해주세요")
      .required("소개는 필수입니다."),
  })
  .required()
type FormData = yup.InferType<typeof schema>

const EducationForm = ({ type }: Props) => {
  const [isRegionSelect, setIsRegionSelect] = useState(false)
  const [isMajorSelect, setIsMajorSelect] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRegionList, setSelectedRegionList] = useState<string[]>([])
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>([])
  const [selectedRegionStep, setSelectedRegionStep] = useState(1)
  const fileUploader = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<File>()
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleUploadedFiles = (files: File[]) => {
    const file = files[0]
    setUploadedImage(file)
    setUploadedImageUrl(URL.createObjectURL(file))
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleSelectCity = (region: string) => {
    setSelectedCity(region)
    setSelectedRegionStep(2)
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

  const deleteRegion = (index: number) => {
    setSelectedRegionList(selectedRegionList.filter((_, i) => i !== index))
  }

  const deleteMajor = (index: number) => {
    setSelectedMajorList(selectedMajorList.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if (selectedDistrict) {
      handleRegionList()
      setSelectedDistrict("")
    }
  }, [selectedDistrict])

  useEffect(() => {
    if (selectedMajor) {
      handleMajorList()
      setSelectedMajor("")
    }
  }, [selectedMajor])

  const handleRegionList = () => {
    const district = `${selectedCity} ${selectedDistrict}`
    setSelectedRegionList([...selectedRegionList, district])
    setSelectedRegionStep(1)
  }

  const handleMajorList = () => {
    setSelectedMajorList([...selectedMajorList, selectedMajor])
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setIsMajorSelect(false)
  }

  const isValidForm =
    isValid &&
    uploadedImageUrl &&
    selectedRegionList.length > 0 &&
    selectedMajorList.length > 0

  const createLesson = async (payload: FormData) => {
    console.log("payload", payload)
    if (!user) {
      return
    }

    try {
      const formData = {
        profile_id: user.id,
        image_url: null,
        locations: selectedRegionList,
        subjects: selectedMajorList,
        name: payload.name,
        intro: payload.intro,
        phone: payload.phone,
        fee: payload.fee,
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("lessons")
        .insert({ ...formData })
        .select("id")
        .single()

      if (error) {
        throw error
      }

      // upload file
      const lessonId = data.id
      if (uploadedImage && lessonId) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `lessons/${lessonId}/${filename}.${extension}`
        const { error: uploadError, data } = await supabase.storage
          .from("artinfo")
          .upload(path, uploadedImage, {
            cacheControl: "36000",
            upsert: true,
          })
        if (uploadError) {
          throw uploadError
        }
        const fileUrl = `https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/${data.path}`
        console.log(fileUrl)

        const { error: updateError } = await supabase
          .from("lessons")
          .update({
            image_url: fileUrl,
          })
          .eq("id", lessonId)

        if (updateError) {
          throw updateError
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["lessons"] })
      successToast("레슨이 등록되었습니다.")
      console.log("SUCCESS!")
      router.replace("/educations")
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    }
  }

  return (
    <div
      className="mx-auto max-w-screen-md px-4 lg:px-0"
      style={{
        height: "calc(100vh - 58px)",
      }}
    >
      <div className="relative mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-center md:text-left">
          {type === "create" ? "레슨등록" : "레슨수정"}
        </h2>
        <Link href="/jobs">
          <IconButton
            ripple={false}
            variant="text"
            size="md"
            className=" text-black"
            onClick={() => router.back()}
          >
            <XMarkIcon className="w-6" />
          </IconButton>
        </Link>
      </div>
      <div className="flex items-center mt-5 mb-2">
        <button
          disabled={selectedRegionList.length >= 3}
          onClick={() => setIsRegionSelect(true)}
          className="rounded-md bg-blue1  p-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
          disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          지역 등록
        </button>
        <span className="text-xs ml-2 opacity-70">
          레슨 가능한 지역을 등록해주세요.
          <br />
          최대 3개까지 등록 가능합니다.
        </span>
      </div>
      <div className="mt-2 flex flex-col  h-[100px] border bg-white rounded-md px-2">
        {selectedRegionList.map((region, index) => (
          <div key={region} className="flex items-center">
            <span className="pt-1">{region}</span>
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black"
              onClick={() => deleteRegion(index)}
            >
              <XMarkIcon className="w-6" />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-5 mb-2">
        <button
          disabled={selectedMajorList.length >= 3}
          onClick={() => setIsMajorSelect(true)}
          className="rounded-md bg-blue1  p-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75
          disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          전공 등록
        </button>
        <span className="text-xs ml-2 opacity-70">
          레슨 가능한 전공을 등록해주세요.
          <br />
          최대 3개까지 등록 가능합니다.
        </span>
      </div>
      <div className="mt-2 flex flex-col  h-[100px] border bg-white rounded-md px-2">
        {selectedMajorList.map((major, index) => (
          <div key={major} className="flex items-center">
            <span className="pt-1">{major}</span>
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black"
              onClick={() => deleteMajor(index)}
            >
              <XMarkIcon className="w-6" />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="mt-2">
        <Input
          {...register("name")}
          placeholder="이름 예) 홍길동 (실명을 입력해주세요.)"
          className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
          labelProps={{
            className: "hidden",
          }}
        />
        <p className="text-sm text-red-500 mt-1">{errors.name?.message}</p>
      </div>
      <div className="mt-2">
        <Input
          {...register("phone")}
          placeholder="전화번호 예) 010-0011-2233"
          className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
          labelProps={{
            className: "hidden",
          }}
        />
        <p className="text-sm text-red-500 mt-1">{errors.phone?.message}</p>
      </div>
      <div className="mt-2">
        <Input
          {...register("fee")}
          placeholder="시간당 수업료(단위: 10000원) 5만원 일시 5 입력"
          type="number"
          className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
          labelProps={{
            className: "hidden",
          }}
        />
        <p className="text-sm text-red-500 mt-1">{errors.fee?.message}</p>
      </div>

      <div className="mt-2">
        <Textarea
          {...register("intro")}
          placeholder="소개 예) 안녕하세요. 홍길동입니다. 10년차 레슨 경력이 있습니다."
          className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
          labelProps={{
            className: "hidden",
          }}
        />
        <p className="text-sm text-red-500 mt-1">{errors.intro?.message}</p>
      </div>

      <div className="flex items-center">
        <IconButton
          variant="text"
          color="blue-gray"
          size="md"
          onClick={openFileUploader}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            />
          </svg>
        </IconButton>
        {!uploadedImageUrl && (
          <span className="opacity-80">
            (필수) 레슨 등록에 사용하실 이미지를 등록해주세요. 예: 프로필사진
            또는 공연사진
          </span>
        )}
        {uploadedImageUrl && (
          <div className="relative bg-gray-300">
            <img
              src={uploadedImageUrl}
              alt="community-write-img"
              className="w-full"
            />
            <button
              className="absolute right-2 top-2 text-white  bg-gray-600 rounded-full p-1"
              onClick={() => setUploadedImageUrl("")}
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-2">
        <Link href="/educations">
          <Button
            size="lg"
            color="red"
            variant="text"
            className="rounded-md hidden md:inline-block"
          >
            취소
          </Button>
        </Link>
        <Button
          size="lg"
          className=" rounded-md bg-indigo-500 w-full md:w-32 whitespace-nowrap"
          disabled={!isValidForm}
          onClick={handleSubmit(createLesson)}
        >
          등록하기
        </Button>
      </div>
      {isRegionSelect && (
        <RegionSelect
          isOpen={isRegionSelect}
          selectedCity={selectedCity}
          closeModal={() => setIsRegionSelect(false)}
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
      <FileUploader
        ref={fileUploader}
        uploadedFiles={handleUploadedFiles}
        multiple
      />
      <Toaster />
    </div>
  )
}

export default EducationForm
