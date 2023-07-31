"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/material"
import Image from "next/image"
import { mdiGoogle } from "@mdi/js"
import Link from "next/link"

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    password: yup
      .string()
      .min(8, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .max(12, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .required()
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.",
      ),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleSignIn = async (payload: FormData) => {
    //
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        ...payload,
      })
      if (error) {
        throw error
      }

      router.refresh()
      router.push("/")
    } catch (error) {
      setIsOpenModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          prompt: "consent",
        },
      },
    })
  }

  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao" as any,
    })
  }

  return (
    <div className="flex flex-1 flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight font-roboto text-indigo-700 drop-shadow-xl">
          <Link href="/">ARTINFO</Link>
        </h2>
        <h3 className="mt-2 text-center text-md font-medium leading-9 tracking-tight">
          로그인을 통해 게시글 채용 알림을 받아보세요!
        </h3>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(handleSignIn)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              이메일
            </label>
            <div className="">
              <Input
                {...register("email")}
                type="email"
                placeholder="Email Address"
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
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                비밀번호
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <Input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                maxLength={12}
                className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                labelProps={{
                  className: "hidden",
                }}
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.password?.message}
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <span>로그인</span>
              )}
            </button>
          </div>
        </form>
        <button
          type="button"
          className="transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md mt-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  disabled:opacity-50 bg-kakao"
          disabled={isLoading}
          onClick={signInWithKakao}
        >
          <Image
            src="/kakao_talk_logo.png"
            alt="Kakao Logo"
            className="mr-3"
            width={24}
            height={24}
          />
          <span className="mr-7 text-black">카카오 로그인</span>
        </button>
        <button
          type="button"
          className="transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md mt-2 text-white px-3 py-1.5 text-sm font-semibold leading-6  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 bg-google"
          disabled={isLoading}
          onClick={signInWithGoogle}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3"
          >
            <path d={mdiGoogle} />
          </svg>
          <span className="mr-8">구글 로그인</span>
        </button>
        <p className="mt-10 text-center text-sm text-gray-500">
          아직 회원이 아니신가요?{" "}
          <a
            href="#"
            className="leading-6 text-indigo-600 hover:text-indigo-500"
          >
            회원이 되시면 더 많은 기능을 이용할 수 있어요
          </a>
        </p>
      </div>

      <Modal
        title="로그인 실패"
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            이메일 또는 비밀번호가 일치하지 않습니다.
          </p>
        </div>

        <div className="mt-4 flex items-end justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setIsOpenModal(false)}
          >
            확인
          </button>
        </div>
      </Modal>
    </div>
  )
}
