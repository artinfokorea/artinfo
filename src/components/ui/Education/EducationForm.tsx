"use client"

import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline"
import {
  IconButton,
  Input,
  Textarea,
  Button,
  Spinner,
} from "@/components/material"
import uuid from "react-uuid"
import Link from "next/link"
import * as yup from "yup"
import React, { useState, useMemo, useEffect, useRef, Fragment } from "react"
import RegionSelect from "@/components/common/RegionSelect"
import { RegionData } from "@/lib/regions"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import FileUploader from "@/components/common/FileUploader"
import MajorSelect from "@/components/common/MajorSelect"
import useAuth from "@/hooks/useAuth"
import useToast from "@/hooks/useToast"
import useSupabase from "@/hooks/useSupabase"
import { DEGREE_VALUES, DEGREE, LESSON } from "@/types/types"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { Listbox, Transition } from "@headlessui/react"
import { Modal } from "@/components/common/Modal"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { apiRequest } from "@/apis"
import * as Sentry from "@sentry/nextjs"

interface Props {
  type: "create" | "update"
  lesson?: LESSON
}

interface Degrees {
  [key: string]: string[]
}

interface DegreeItem {
  [key: string]: string
}

const schema = yup
  .object({
    phone: yup
      .string()
      .matches(
        /^(\d{3}-\d{4}-\d{4})$/,
        '전화번호는 숫자 3개, "-" 문자, 숫자 4개, "-" 문자, 숫자 4개 형식이어야 합니다.',
      )
      .required("전화번호는 필수 입력 사항입니다."),
    name: yup.string().min(2, "2자리 이상 실명을 입력해주세요."),
    // .required("이름은 실명을 입력해주셔야하며 필수입니다."),
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

const EducationForm = ({ type, lesson }: Props) => {
  const [isRegionSelect, setIsRegionSelect] = useState(false)
  const [isMajorSelect, setIsMajorSelect] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedRegionList, setSelectedRegionList] = useState<string[]>(
    lesson?.locations || [],
  )
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>(
    lesson?.majors || [],
  )
  const [selectedRegionStep, setSelectedRegionStep] = useState(1)
  const fileUploader = useRef<HTMLInputElement>(null)
  const [uploadedImage, setUploadedImage] = useState<File>()
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    lesson?.imageUrl || "",
  )
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const queryClient = useQueryClient()
  const { successToast, errorToast } = useToast()
  const [selectedDegree, setSelectedDegree] = useState("BACHELOR")
  const [selectedSchool, setSelectedSchool] = useState("")
  const [selectedDegreeList, setSelectedDegreeList] = useState<DegreeItem[]>(
    lesson?.degrees || [],
  )
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const params = useParams()
  const pathname = usePathname()
  const listPath = pathname.slice(0, pathname.lastIndexOf("/"))

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
    formState: { errors },
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

  const deleteDegree = (index: number) => {
    setSelectedDegreeList(selectedDegreeList.filter((_, i) => i !== index))
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

  useEffect(() => {
    if (lesson) {
      setValue("name", lesson.name)
      setValue("phone", lesson.phone)
      setValue("fee", lesson.fee)
      setValue("intro", lesson.intro)
      if (lesson.image_url) {
        setUploadedImageUrl(lesson.image_url)
      }
    }
  }, [lesson])

  const handleRegionList = () => {
    const district = `${selectedCity} ${selectedDistrict}`
    setSelectedRegionList([...selectedRegionList, district])
    setSelectedRegionStep(1)
  }

  const handleDegreeList = () => {
    const degree = { [selectedDegree]: selectedSchool }

    setSelectedDegreeList([...selectedDegreeList, degree])
    setSelectedDegree("BACHELOR")
    setSelectedSchool("")
  }

  const handleMajorList = () => {
    setSelectedMajorList([...selectedMajorList, selectedMajor])
  }

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setIsMajorSelect(false)
  }

  // const degrees = useMemo(() => {
  //   return selectedDegreeList.reduce((acc, obj) => {
  //     const key = Object.keys(obj)[0]
  //     const value = obj[key]

  //     if (!acc[key]) {
  //       acc[key] = [value]
  //     } else {
  //       acc[key].push(value)
  //     }

  //     return acc
  //   }, {} as Degrees)
  // }, [selectedDegreeList])

  const isValidForm =
    // isValid &&
    uploadedImageUrl &&
    selectedRegionList.length > 0 &&
    selectedMajorList.length > 0 &&
    selectedDegreeList.length > 0

  const createLesson = async (payload: FormData) => {
    if (!user) {
      return
    }
    setIsLoading(true)
    try {
      // upload file
      if (uploadedImage) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `lessons/${user.id}/${filename}.${extension}`
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

        // const { error: updateError } = await supabase
        //   .from("lessons")
        //   .update({
        //     image_url: fileUrl,
        //   })
        //   .eq("id", lessonId)

        const formData = {
          userId: user.id,
          imageUrl: fileUrl,
          locations: selectedRegionList,
          majors: selectedMajorList,
          name: payload.name,
          intro: payload.intro,
          phone: payload.phone,
          fee: payload.fee,
          degrees: selectedDegreeList,
        }

        await apiRequest.post("/lessons", formData)
        await supabase
          .from("profiles")
          .update({ is_teacher: true })
          .eq("id", user.id)
      }

      await queryClient.invalidateQueries({ queryKey: ["lessons"] })
      successToast("레슨이 등록되었습니다.")
      router.push(listPath)
    } catch (error: any) {
      errorToast("레슨 등록에 실패했습니다.")
      console.error(error.message)
      Sentry.captureException(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateLesson = async (payload: FormData) => {
    if (!user || !lesson) {
      return
    }

    if (user.id !== lesson.userId) {
      errorToast("본인의 레슨만 수정할 수 있습니다.")
      router.push(listPath)
      return
    }

    const formData = {
      userId: user.id,
      imageUrl: "",
      name: payload.name,
      fee: payload.fee,
      intro: payload.intro,
      phone: payload.phone,
      locations: selectedRegionList,
      majors: selectedMajorList,
      degrees: selectedDegreeList,
    }

    setIsLoading(true)
    try {
      // upload file

      if (uploadedImage) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `educations/${user.id}/${filename}.${extension}`
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

        formData.imageUrl = fileUrl

        await apiRequest.put(`/lessons/${params.id}`, formData)
      } else {
        formData.imageUrl = uploadedImageUrl

        await apiRequest.put(`/lessons/${params.id}`, formData)
      }

      await queryClient.invalidateQueries({ queryKey: ["lessons"] })
      await queryClient.invalidateQueries({ queryKey: ["lesson"] })
      successToast("레슨이 수정되었습니다.")

      router.push(listPath)
    } catch (error: any) {
      errorToast("레슨 수정에 실패했습니다.")
      console.error(error.message)
      Sentry.captureException(error)
    } finally {
      setIsLoading(true)
    }
  }

  const items = [
    { title: "학사", value: "BACHELOR" },
    { title: "석사", value: "MASTER" },
    { title: "박사", value: "DOCTOR" },
  ]

  const handleComplete = (payload: FormData) => {
    if (type === "update" && lesson) {
      handleUpdateLesson(payload)
    } else if (type === "create") {
      createLesson(payload)
    }
  }

  const deleteLessonMutation = useMutation({
    mutationFn: async () => {
      return apiRequest.delete(`/lessons`, params.id)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.push(listPath)
      queryClient.invalidateQueries(["lessons"])
      successToast("레슨이 삭제되었습니다.")
    },
  })

  const handleDeleteLesson = () => {
    if (type === "update" && lesson) deleteLessonMutation.mutate()
  }

  return (
    <div
      className="mx-auto max-w-screen-md px-4 lg:px-0 overflow-auto pb-20 md:pb-10"
      // style={{
      //   height: "calc(100vh - 58px)",
      // }}
    >
      <div className="relative mt-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-center md:text-left">
          {type === "create" ? "레슨등록" : "레슨수정"}
        </h2>
        <div>
          {type === "update" && (
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black mx-0"
              onClick={() => setIsOpenModal(true)}
            >
              <TrashIcon className="w-6" />
            </IconButton>
          )}
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
          <div key={uuid()} className="flex items-center text-sm">
            <span className="pt-[2px] ">{region}</span>
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black"
              onClick={() => deleteRegion(index)}
            >
              <XMarkIcon className="w-5 mb-[2px]" />
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
          <div key={uuid()} className="flex items-center text-sm">
            <span className="pt-[2px">{major}</span>
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black"
              onClick={() => deleteMajor(index)}
            >
              <XMarkIcon className="w-5 mb-[2px]" />
            </IconButton>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-5 mb-2">
        <span className="text-lg font-semibold">학력 등록</span>
        <span className="text-xs ml-2 opacity-70">
          레슨하실 선생님의 학력을 입력해주세요.
        </span>
      </div>
      <div className="flex h-12">
        <div className="w-40 h-10">
          <Listbox value={selectedDegree} onChange={setSelectedDegree}>
            <div className="relative z-10">
              <Listbox.Button className="w-full h-11 relative  cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left  focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">
                  {DEGREE_VALUES[selectedDegree as DEGREE]}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {items.map(item => (
                    <Listbox.Option
                      key={item.title}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 z-20  ${
                          active
                            ? "bg-amber-100 text-amber-900"
                            : "text-gray-900"
                        }`
                      }
                      value={item.value}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {item.title}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="relative flex w-full max-w-[24rem] ml-4">
          <Input
            placeholder="대학명 예: 한국예술종합학교"
            value={selectedSchool}
            variant="standard"
            onChange={e => setSelectedSchool(e.target.value)}
            className="pb-4  rounded-md border-none !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
          />
          <Button
            size="sm"
            color={selectedSchool ? "blue" : "blue-gray"}
            disabled={!selectedSchool}
            className="!absolute right-1 top-[6px] rounded"
            onClick={() => handleDegreeList()}
          >
            추가
          </Button>
        </div>
      </div>

      <div className="mt-2 flex flex-col  h-[100px] border bg-white rounded-md px-2 overflow-auto">
        {selectedDegreeList.map((degree, index) => (
          <div key={uuid()} className="flex items-center text-sm">
            {Object.entries(degree).map(([key, value]) => (
              <span className="pt-[2px]" key={value}>
                {DEGREE_VALUES[key as DEGREE]} - {value}
              </span>
            ))}
            <IconButton
              ripple={false}
              variant="text"
              size="sm"
              className=" text-black"
              onClick={() => deleteDegree(index)}
            >
              <XMarkIcon className="w-5" />
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
          placeholder="시간당 수업료 예) 50000"
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
        {!uploadedImageUrl && (
          <>
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
            <span className="opacity-80 text-sm">
              (필수) 레슨 등록에 사용하실 이미지를 등록해주세요.
            </span>
          </>
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
        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <Button
            size="lg"
            className=" rounded-md bg-indigo-500 w-full md:w-32 whitespace-nowrap"
            disabled={!isValidForm}
            onClick={handleSubmit(handleComplete)}
          >
            {type === "create" ? "등록하기" : "수정하기"}
          </Button>
        )}
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
      <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      <Modal
        title="레슨 삭제"
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">레슨을 삭제하시겠습니까?</p>
        </div>

        <div className="mt-4 flex items-end justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md mr-2 border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setIsOpenModal(false)}
          >
            취소
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => {
              handleDeleteLesson()
              setIsOpenModal(false)
            }}
          >
            확인
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default EducationForm
