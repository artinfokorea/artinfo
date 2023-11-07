"use client"

import Link from "next/link"
import React, { useRef, useState, Fragment } from "react"
import { Button, IconButton, Input, Spinner } from "@/components/material"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import FileUploader from "@/components/common/FileUploader"
import useSupabase from "@/hooks/useSupabase"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth"
import { RECRUIT_JOBS_CATEGORY } from "@/types/types"
import dynamic from "next/dynamic"
import { useQueryClient } from "@tanstack/react-query"
import { Listbox, Transition } from "@headlessui/react"
import Loading from "@/components/ui/Loading/Loading"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

const QuillEditor = dynamic(
  () => import("@/components/ui/Editor/QuillEditor"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
)

const items = [
  { title: "종교", value: "RELIGION" },
  { title: "교원", value: "LECTURER" },
  { title: "기타", value: "ETC" },
  { title: "연주단체", value: "ART_ORGANIZATION" },
]

const schema = yup
  .object({
    title: yup
      .string()
      .max(50, "제목 글자수는 50글자까지 허용합니다.")
      .required("채용 제목은 필수입니다."),
    company_name: yup.string().required("채용 기관명은 필수입니다."),
    linkUrl: yup
      .string()
      .url("유효한 url 주소를 입력해주세요.")
      .required("채용 기관 주소는 필수입니다."),
  })
  .required()
type FormData = yup.InferType<typeof schema>

const JobCreateForm = () => {
  const { user } = useAuth()
  const [uploadedImage, setUploadedImage] = useState<File>()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const [htmlStr, setHtmlStr] = useState<string>("")
  const [selectedType, setSelectedType] = useState("RELIGION")
  const supabase = useSupabase()
  const router = useRouter()
  const quillRef = useRef()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleUploadedFiles = (files: File[]) => {
    const file = files[0]
    setUploadedImage(file)
    setUploadedImageUrl(URL.createObjectURL(file))
  }

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const createJob = async (payload: FormData) => {
    console.log("payload", payload)
    const { company_name, title } = payload
    if (!user) {
      return
    }

    setIsLoading(true)
    try {
      const formData = {
        profile_id: user.id,
        company_image_url: uploadedImageUrl,
        company_name,
        contents: htmlStr,
        title,
        link_url: payload.linkUrl,
        category: selectedType as RECRUIT_JOBS_CATEGORY,
        created_at: new Date().toISOString(),
      }
      const { data, error } = await supabase
        .from("recruit_jobs")
        .insert({ ...formData })
        .select("id")
        .single()

      if (error) {
        throw error
      }
      // upload file
      const jobId = data.id
      if (uploadedImage && jobId) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `recruits_jobs/${jobId}/${filename}.${extension}`
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

        const { error: updateError } = await supabase
          .from("recruit_jobs")
          .update({
            company_image_url: fileUrl,
          })
          .eq("id", jobId)

        if (updateError) {
          throw updateError
        }
      }
      await queryClient.invalidateQueries({ queryKey: ["recruit_jobs"] })
      console.log("SUCCESS!")
      router.push("/jobs")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (value: any) => setSelectedType(value)

  return (
    <div className="mx-auto max-w-screen-lg px-4 lg:px-0 overflow-auto ">
      <div className=" flex flex-col ">
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
            채용 등록
          </h2>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto mt-4">
          <div className="mb-2 text-[#a3a3a3] text-sm cursor-pointer w-32 relative z-10">
            <Listbox
              value={selectedType}
              onChange={value => setSelectedType(value)}
            >
              <Listbox.Button className="w-full border bg-white px-2 items-center py-1 rounded-lg flex justify-between">
                {items.filter(item => item.value === selectedType)[0].title}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 ml-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
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
            </Listbox>
          </div>
          <div>
            <div className="">
              <Input
                {...register("title")}
                type="text"
                placeholder="채용 제목"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.title?.message}
              </p>
            </div>
            <div className="mt-2">
              <Input
                {...register("company_name")}
                placeholder="채용 기관명 예): 국립합창단"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.company_name?.message}
              </p>
            </div>
            <div className="mt-2">
              <Input
                {...register("linkUrl")}
                type="text"
                placeholder="채용기관 주소 예): https://naver.com"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.linkUrl?.message}
              </p>
            </div>

            <QuillEditor
              quillRef={quillRef}
              htmlContent={htmlStr}
              setHtmlContent={setHtmlStr}
            />
            {uploadedImageUrl && (
              <div className="relative bg-gray-300">
                <img
                  src={uploadedImageUrl}
                  alt="community-write-img"
                  className="w-full"
                />
                <button
                  className="absolute right-2 top-2 text-white md:hidden bg-gray-600 rounded-full p-1"
                  onClick={() => setUploadedImage(undefined)}
                >
                  <XMarkIcon className="w-5" />
                </button>
              </div>
            )}
          </div>
          <div className="border-b border-gray-300">
            <IconButton
              variant="text"
              color="blue-gray"
              size="md"
              //   disabled={!!uploadedImageUrl}
              onClick={openFileUploader}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                />
              </svg>
            </IconButton>
            <span className="text-sm">대표사진 업로드</span>
            <FileUploader
              ref={fileUploader}
              uploadedFiles={handleUploadedFiles}
            />
          </div>

          <div>
            <div className="flex items-center justify-between border-t py-4 gap-x-2">
              <div className="flex gap-2 flex-1 md:flex-none">
                <Button
                  size="lg"
                  color="red"
                  variant="text"
                  className="rounded-md whitespace-nowrap"
                  onClick={() => router.push("/jobs")}
                >
                  뒤로가기
                </Button>
                {isLoading ? (
                  <div className="w-full flex items-center justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <Button
                    size="lg"
                    className="rounded-md bg-indigo-500 w-full md:w-32"
                    disabled={!isDirty || !isValid}
                    onClick={handleSubmit(createJob)}
                  >
                    등록하기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCreateForm
