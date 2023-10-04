"use client"

import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useRef, useState } from "react"
import * as yup from "yup"
import { Button, IconButton, Input, Textarea } from "@/components/material"
import { yupResolver } from "@hookform/resolvers/yup"
import useSupabase from "@/hooks/useSupabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { XMarkIcon } from "@heroicons/react/24/outline"
import useAuth from "@/hooks/useAuth"
import FileUploader from "@/components/Common/FileUploader"
import { fetchOrganization } from "../api"

interface IProps {
  organizationId: number
}

const schema = yup
  .object({
    name: yup
      .string()
      .max(50, "이름의 글자수는 50글자까지 허용합니다.")
      .required("기관 이름을 입력해주세요."),
    desc: yup.string(),
    site: yup.string(),
    address: yup.string(),
    email: yup.string().email("유효한 이메일 형식이 아닙니다.").required(),
  })
  .required()
type FormData = yup.InferType<typeof schema>

export default function Container({ organizationId }: IProps) {
  const supabase = useSupabase()
  const { user } = useAuth()
  const router = useRouter()
  const [uploadedImage, setUploadedImage] = useState<File>()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")

  const handleUploadedFiles = (files: File[]) => {
    const file = files[0]
    setUploadedImage(file)
    setUploadedImageUrl(URL.createObjectURL(file))
  }

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const { data: organization } = useQuery({
    queryKey: ["organizations", organizationId],
    suspense: true,
    queryFn: () => fetchOrganization(organizationId),
  })

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: organization?.name || "",
      desc: organization?.desc || "",
      site: organization?.site || "",
      address: organization?.address || "",
      email: organization?.email || "",
    },
  })

  console.log("image", organization?.logo_image)

  const updateOrganizations = async (payload: FormData) => {
    console.log("payload", payload)
    if (!user) {
      return
    }
    try {
      const { error } = await supabase
        .from("organizations")
        .update(payload)
        .eq("id", organizationId)
      if (error) {
        throw error
      }
      router.push("/admin/organizations")
    } catch (e: any) {
      console.log("error", e)
    } finally {
      console.log("finally")
    }
  }

  return (
    <div
      className="mx-auto max-w-screen-lg px-4 lg:px-0"
      style={{
        height: "calc(100vh - 58px)",
      }}
    >
      <div className="h-full flex flex-col">
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
            기관 상세
          </h2>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          <div className="pb-2 border-b border-gray-300">
            <div className="">
              <Input
                {...register("name")}
                type="text"
                placeholder="기관 이름"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.name?.message}
              </p>
            </div>
            <div className="mt-5">
              <Textarea
                {...register("desc")}
                placeholder="기관 상세"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.desc?.message}
              </p>
            </div>
            <div className="">
              <Input
                {...register("email")}
                type="email"
                placeholder="기관 이메일"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>
            <div className="">
              <Input
                {...register("site")}
                type="email"
                placeholder="웹사이트"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>
            <div className="">
              <Input
                {...register("address")}
                type="email"
                placeholder="주소"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>
            {organization?.logo_image && (
              <div className="relative bg-gray-300">
                <img
                  src={uploadedImageUrl || organization?.logo_image}
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
            <IconButton
              variant="text"
              color="blue-gray"
              size="md"
              disabled={!!uploadedImageUrl}
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
            <FileUploader
              ref={fileUploader}
              uploadedFiles={handleUploadedFiles}
            />
          </div>

          <div>
            <div className="flex w-full items-center justify-between border-t py-4 gap-x-2">
              <div className="flex gap-2 flex-1 md:flex-none">
                <Button
                  size="lg"
                  color="red"
                  variant="text"
                  className="rounded-md hidden md:inline-block"
                  onClick={() => router.push("/admin/organizations")}
                >
                  뒤로가기
                </Button>
                <Button
                  size="lg"
                  className="rounded-md bg-indigo-500 w-full md:w-32"
                  onClick={handleSubmit(updateOrganizations)}
                >
                  수정하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
