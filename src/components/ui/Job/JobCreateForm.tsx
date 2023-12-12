"use client"

import Link from "next/link"
import React, { useRef, useState, useEffect } from "react"
import { Button, IconButton, Input, Spinner } from "@/components/material"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import FileUploader from "@/components/common/FileUploader"
import useSupabase from "@/hooks/useSupabase"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth"
import { JobDetail } from "@/types/types"
import dynamic from "next/dynamic"
import { useQueryClient } from "@tanstack/react-query"
import Loading from "@/components/ui/Loading/Loading"
import JobMajorSelect from "@/components/common/JobMajorSelect"
import { createJob, updateJob } from "@/apis/job"
import FilterTag from "@/components/common/FilterTag"
import useToast from "@/hooks/useToast"

const QuillEditor = dynamic(
  () => import("@/components/ui/Editor/QuillEditor"),
  {
    loading: () => <Loading />,
    ssr: false,
  },
)

const schema = yup
  .object({
    title: yup
      .string()
      .max(50, "제목 글자수는 50글자까지 허용합니다.")
      .required("채용 제목은 필수입니다."),
    company_name: yup.string().required("채용 기관명은 필수입니다."),
    linkUrl: yup.string().url("유효한 url 주소를 입력해주세요."),
  })
  .required()
type FormData = yup.InferType<typeof schema>

interface Props {
  type?: "create" | "update"
  job?: JobDetail
}

const JobCreateForm = ({ type, job }: Props) => {
  const { user } = useAuth()
  const [uploadedImage, setUploadedImage] = useState<File>()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    job?.companyImageUrl || "",
  )

  const [htmlStr, setHtmlStr] = useState<string>("")
  const [selectedMajor, setSelectedMajor] = useState("")
  const [selectedMajorList, setSelectedMajorList] = useState<string[]>(
    job?.majors || [],
  )
  const [isMajorModal, setIsMajorModal] = useState(false)
  const supabase = useSupabase()
  const router = useRouter()
  const quillRef = useRef()
  const queryClient = useQueryClient()
  const { successToast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleSelectMajor = (major: string) => {
    setSelectedMajor(major)
    setIsMajorModal(false)
  }

  const handleUploadedFiles = (files: File[]) => {
    const file = files[0]
    setUploadedImage(file)
    setUploadedImageUrl(URL.createObjectURL(file))
  }

  const deleteMajor = (index: number) => {
    setSelectedMajorList(selectedMajorList.filter((_, i) => i !== index))
  }

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  useEffect(() => {
    if (selectedMajor) {
      setSelectedMajorList([...selectedMajorList, selectedMajor])
      setSelectedMajor("")
    }
  }, [selectedMajor])

  useEffect(() => {
    if (job) {
      setValue("title", job.title)
      setValue("company_name", job.companyName)
      setValue("linkUrl", job.linkUrl)
      setHtmlStr(job.contents)
    }
  }, [job])

  const handleCreateJob = async (payload: FormData) => {
    console.log("payload", payload)
    const { company_name, title, linkUrl } = payload
    if (!user) {
      return
    }

    setIsLoading(true)
    try {
      if (uploadedImage) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `recruits_jobs/${user.id}/${filename}.${extension}`
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

        const formData = {
          userId: user.id,
          companyImageUrl: fileUrl,
          companyName: company_name,
          contents: htmlStr,
          title,
          majors: selectedMajorList,
          linkUrl,
        }

        await createJob(formData)

        // const { error: updateError } = await supabase
        //   .from("recruit_jobs")
        //   .update({
        //     company_image_url: fileUrl,
        //   })
        //   .eq("id", jobId)

        // if (updateError) {
        //   throw updateError
        // }
      }
      await queryClient.invalidateQueries({ queryKey: ["recruit_jobs"] })
      successToast("채용 글이 등록되었습니다.")
      router.push("/jobs")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateJob = async (payload: FormData) => {
    const { company_name, title, linkUrl } = payload
    if (!user || !job) {
      return
    }

    const formData = {
      userId: user.id,
      companyImageUrl: "",
      companyName: company_name,
      contents: htmlStr,
      title,
      majors: selectedMajorList,
      linkUrl,
    }

    setIsLoading(true)
    try {
      if (uploadedImage) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `recruits_jobs/${user.id}/${filename}.${extension}`
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

        formData.companyImageUrl = fileUrl

        await updateJob(job.id, formData)
      } else {
        formData.companyImageUrl = job.companyImageUrl
        await updateJob(job.id, formData)
      }
      await queryClient.invalidateQueries({ queryKey: ["recruit_jobs"] })
      successToast("채용 글이 수정되었습니다.")
      router.push("/jobs")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="flex items-center">
            <button
              onClick={() => setIsMajorModal(!isMajorModal)}
              className="flex my-2 items-center rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400 whitespace-nowrap
          "
            >
              <span>전공 검색</span>
            </button>
            <div className="flex ml-2 overflow-x-auto w-full">
              {selectedMajorList.map((major, index) => (
                <FilterTag
                  key={major}
                  tag={major}
                  color="blue"
                  index={index}
                  deleteItem={deleteMajor}
                />
              ))}
            </div>
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
                ) : type === "create" ? (
                  <Button
                    size="lg"
                    className="rounded-md bg-indigo-500 w-full md:w-32"
                    disabled={!isDirty || !isValid}
                    onClick={handleSubmit(handleCreateJob)}
                  >
                    등록하기
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="rounded-md bg-indigo-500 w-full md:w-32"
                    disabled={!isValid}
                    onClick={handleSubmit(handleUpdateJob)}
                  >
                    수정하기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isMajorModal && (
        <JobMajorSelect
          isOpen={isMajorModal}
          closeModal={() => setIsMajorModal(!isMajorModal)}
          handleSelectMajor={handleSelectMajor}
        />
      )}
    </div>
  )
}

export default JobCreateForm
