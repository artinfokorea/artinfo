"use client"

import { Button, IconButton } from "@/components/material"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import React, { useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { ErrorMessage } from "@hookform/error-message"
import FileUploader from "@/components/common/FileUploader"
import useAuth from "@/hooks/useAuth"
import { createCompanyCertification } from "@/apis/company"
import useToast from "@/hooks/useToast"
import { useRouter } from "next/navigation"
import useSupabase from "@/hooks/useSupabase"
import { Label } from "../label"
import { Input } from "../input"

const schema = yup
  .object({
    companyName: yup
      .string()
      .min(3, "세글자 이상 입력해주세요.")
      .required("채용 기관명은 필수입니다."),
    name: yup
      .string()
      .min(2, "이름은 두글자 이상 입력해주세요.")
      .required("채용 기관명은 필수입니다."),
    secretNickname: yup
      .string()
      .min(2, "익명아이디는 두글자 이상 입력해주세요.")
      .required("익명아이디는 필수입니다."),
    images: yup
      .array()
      .of(yup.string().required("이미지 URL은 필수입니다."))
      .min(2, "이미지는 최소한 두 개 이상 필요합니다.")
      .required("이미지는 최소한 두 개 이상 필요합니다."),
  })
  .required()
export type OrganizationAuthFormData = yup.InferType<typeof schema>

const OrganizationAuthContainer = () => {
  const fileUploader = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const { user } = useAuth()
  const router = useRouter()
  const { successToast, errorToast } = useToast()
  const supabase = useSupabase()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleUploadedFiles = (files: File[]) => {
    setUploadedImages(files)
  }

  const deleteImage = async (index: number) => {
    const newUploadedImages = [...uploadedImages]
    newUploadedImages.splice(index, 1)

    setUploadedImages(newUploadedImages)
  }

  const uploadedImageUrls = useMemo(() => {
    const urls: string[] = []
    uploadedImages.forEach(uploadedImage => {
      urls.push(URL.createObjectURL(uploadedImage))
    })
    setValue("images", urls)
    return urls
  }, [uploadedImages])

  const handleCompanyCertificate = async (
    payload: OrganizationAuthFormData,
  ) => {
    if (!user) {
      return
    }

    setIsLoading(true)

    try {
      const fileUrls: string[] = []
      if (uploadedImages.length > 1) {
        for await (const uploadedImage of uploadedImages) {
          const filename = new Date().getTime().toString()
          const extension = uploadedImage.name.split(".")[1]
          const path = `posts/${user.id}/${filename}.${extension}`
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
          fileUrls.push(fileUrl)
        }
      }

      const formData = {
        userId: user.id,
        name: payload.name,
        secretNickname: payload.secretNickname,
        companyName: payload.companyName,
        imageUrls: fileUrls,
      }

      await createCompanyCertification(formData)

      successToast(
        "인증 신청이 완료되었습니다. 인증완료까지는 1일에서 3일까지 소요될 수 있습니다.",
      )
      router.push("/")
    } catch (error) {
      errorToast("인증 신청에 실패했습니다.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 lg:px-0 overflow-auto pb-20 md:pb-0">
      <div className="mt-12">
        <Link href="/">
          <IconButton
            ripple={false}
            variant="text"
            size="md"
            className="absolute top-4 text-black md:hidden"
          >
            <XMarkIcon className="w-6" />
          </IconButton>
        </Link>
        <h2 className="text-2xl font-bold text-center md:text-left">
          소속단체 인증
        </h2>
        <form
          className="my-8"
          onSubmit={handleSubmit(handleCompanyCertificate)}
        >
          <div className="grid items-center gap-1.5 mb-2">
            <Label htmlFor="이름">이름</Label>
            <Input
              type="text"
              placeholder="예) 홍길동"
              {...register("name")}
              className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
            />
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="grid items-center gap-1.5 mb-2">
            <Label htmlFor="소속 단체명">소속 단체명</Label>
            <Input
              type="text"
              placeholder="예) 예술의전당"
              {...register("companyName")}
              className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
            />
            <ErrorMessage
              errors={errors}
              name="companyName"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="grid items-center gap-1.5 mb-2">
            <Label htmlFor="익명 아이디">익명 아이디</Label>
            <Input
              type="text"
              placeholder="예) 플룻부는사나이"
              {...register("secretNickname")}
              className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
            />
            <ErrorMessage
              errors={errors}
              name="secretNickname"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {uploadedImageUrls?.map((image, index) => (
              <div className="relative bg-gray-300 " key={image}>
                <img src={image} alt="community-write-img" className="w-full" />
                <button
                  className="absolute right-2 top-2 text-white  bg-gray-600 rounded-full p-1"
                  onClick={() => deleteImage(index)}
                >
                  <XMarkIcon className="w-5" />
                </button>
              </div>
            ))}
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
            <span className="text-sm">
              인증 자료 업로드 (최소 2장 ~ 최대 5장)
            </span>
            <ErrorMessage
              errors={errors}
              name="images"
              render={({ message }) => (
                <p className="text-error font-semibold">{message}</p>
              )}
            />

            <FileUploader
              ref={fileUploader}
              multiple
              uploadedFiles={handleUploadedFiles}
            />
          </div>
          <ol className="text-sm text-dimgray list-decimal px-4 break-keep">
            <li className="my-1">
              인증 자료의 예) 재직증명서, 신분증, 단체 단원 소개 이미지 등
              <strong> 신분과 재직 확인이 가능한 각종 서류(택 2).</strong>
            </li>
            <li className="my-1">
              인증에 사용되는 정보는 철저히 비공개로 관리됩니다.
            </li>
            <li className="my-1">
              인증에는 1~3일의 시간이 소요될 수 있습니다.
            </li>
          </ol>
          <div className="grid grid-cols-2  gap-4 my-4">
            <Link href="/">
              <Button
                size="lg"
                color="red"
                variant="text"
                className="rounded-md bg-primaryred text-white w-full  mr-2 whitespace-nowrap"
              >
                취소
              </Button>
            </Link>
            <Button
              size="lg"
              type="submit"
              disabled={isLoading}
              className=" rounded-md bg-indigo-500 w-full  whitespace-nowrap"
            >
              인증하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OrganizationAuthContainer
