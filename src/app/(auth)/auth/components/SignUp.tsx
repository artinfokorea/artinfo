"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import toast, { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"
import useSupabase from "@/hooks/useSupabase"
import { Modal } from "@/components/ui/Modal"
import Link from "next/link"

interface IForm {
  email: string
  name: string
  password: string
  re_password: string
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("이메일 형식이 아닙니다.")
      .required("이메일을 입력해주세요."),
    name: yup
      .string()
      .required("이름을 입력해주세요.")
      .min(3, "이름은 3자 이상 20자 이하로 입력해주세요.")
      .max(20, "이름은 3자 이상 20자 이하로 입력해주세요."),
    password: yup
      .string()
      .required("비밀번호를 입력해주세요.")
      .min(8, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .max(12, "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.")
      .matches(
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/,
        "8자 이상 12자 이하로 영문, 숫자, 특수문자를 포함해주세요.",
      ),
    re_password: yup
      .string()
      .required("재확인 비밀번호를 입력해주세요.")
      .oneOf([yup.ref("password")], "재확인 비밀번호가 일치 하지 않습니다."),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const supabase = useSupabase()
  const router = useRouter()

  const notify = (text: string) =>
    toast.error(text, {
      duration: 4000,
      position: "bottom-center",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#EA2A2A",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    })

  const handleSignUp = async (payload: FormData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
          },
        },
      })
      if (error) {
        throw error
      }
      setIsOpenModal(true)
    } catch (error: any) {
      notify(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight font-roboto text-indigo-700 drop-shadow-xl">
          <Link href="/">ARTINFO</Link>
        </h2>
        <h3 className="mt-2 text-center text-md font-medium leading-9 tracking-tight">
          회원가입
        </h3>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6 text-primary"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              이메일
            </label>
            <div className="mt-2">
              <input
                {...register("email")}
                type="email"
                autoComplete="off"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.email?.message}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6"
            >
              이름
            </label>
            <div className="mt-2">
              <input
                {...register("name")}
                type="text"
                autoComplete="off"
                maxLength={20}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.name?.message}
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
            </div>
            <div className="mt-2">
              <input
                {...register("password")}
                type="password"
                autoComplete="off"
                className="block w-full rounded-md border-0  bg-white/5 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.password?.message}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                재확인 비밀번호
              </label>
            </div>
            <div className="mt-2">
              <input
                {...register("re_password")}
                type="password"
                autoComplete="off"
                className="block w-full rounded-md border-0  bg-white/5 py-1.5 text-primary shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
              <p className="text-sm text-red-500 mt-1">
                {errors.re_password?.message}
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
                <span>회원가입</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <Modal
        title="이메일 인증"
        isOpen={isOpenModal}
        closeModal={() => {
          setIsOpenModal(false)
          router.push("/posts")
        }}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            가입하신 이메일로 인증코드가 발송되었습니다.
            <br />
            인증코드를 확인해주세요.
          </p>
        </div>

        <div className="mt-4 flex items-end justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => {
              setIsOpenModal(false)
              router.push("/posts")
            }}
          >
            확인
          </button>
        </div>
      </Modal>
      <Toaster />
    </div>
  )
}
