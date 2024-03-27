"use client"

import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { Button, IconButton, Input, Textarea } from "@/components/material"
import { yupResolver } from "@hookform/resolvers/yup"
import useSupabase from "@/hooks/useSupabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { XMarkIcon } from "@heroicons/react/24/outline"
import useAuth from "@/hooks/useAuth"
import { fetchInquiry } from "@/app/(admin)/admin/inquiries/api"

interface IProps {
  inquiryId: number
}

const schema = yup
  .object({
    title: yup
      .string()
      .max(50, "제목의 글자수는 50글자까지 허용합니다.")
      .required("문의 제목을 입력해주세요."),
    contents: yup.string().required(),
    email: yup.string().email("유효한 이메일 형식이 아닙니다.").required(),
  })
  .required()
type FormData = yup.InferType<typeof schema>

export default function Container({ inquiryId }: IProps) {
  const supabase = useSupabase()
  const { user } = useAuth()
  const router = useRouter()

  const { data: inquiry } = useQuery({
    queryKey: ["inquiry", inquiryId],
    suspense: true,
    queryFn: () => fetchInquiry(inquiryId),
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
      title: inquiry?.title || "",
      contents: inquiry?.contents || "",
      email: inquiry?.email || "",
    },
  })

  const updateInquiry = async (payload: FormData) => {
    if (!user) {
      return
    }
    try {
      const { error } = await supabase
        .from("inquiries")
        .update(payload)
        .eq("id", inquiryId)
      if (error) {
        throw error
      }
      router.push("/admin/inquiries")
    } catch (e: any) {
      console.log("error", e)
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
          <Link href="/posts">
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
            문의 상세
          </h2>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          <div className="pb-2 border-b border-gray-300">
            <div className="">
              <Input
                {...register("title")}
                type="text"
                placeholder="문의 제목"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.title?.message}
              </p>
            </div>
            <div className="mt-5">
              <Textarea
                {...register("contents")}
                placeholder="문의 내용"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.contents?.message}
              </p>
            </div>
            <div className="">
              <Input
                {...register("email")}
                type="email"
                placeholder="답변받으실 이메일"
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>
          </div>

          <div>
            <div className="flex w-full items-center justify-between border-t py-4 gap-x-2">
              <div className="flex gap-2 flex-1 md:flex-none">
                <Button
                  size="lg"
                  color="red"
                  variant="text"
                  className="rounded-md hidden md:inline-block"
                  onClick={() => router.push("/admin/inquiries")}
                >
                  뒤로가기
                </Button>
                <Button
                  size="lg"
                  className="rounded-md bg-indigo-500 w-full md:w-32"
                  onClick={handleSubmit(updateInquiry)}
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
