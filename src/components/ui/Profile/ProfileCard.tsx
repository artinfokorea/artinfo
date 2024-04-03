"use client"

import { Button, Input, IconButton } from "@/components/material"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import useToast from "@/hooks/useToast"
import { useRecoilState } from "recoil"
import { userProfileState } from "@/atoms/userProfile"
import { CameraIcon } from "@heroicons/react/24/outline"
import FileUploader from "@/components/common/FileUploader"
import { USER } from "@/types/types"
import { updateMe } from "@/apis/user"
import useSupabase from "@/hooks/useSupabase"
import { ErrorMessage } from "@hookform/error-message"
import useAuth from "@/hooks/useAuth"
import { useQueryClient } from "@tanstack/react-query"
import { Label } from "../label"

type IProps = {
  user: USER
}

const schema = yup
  .object({
    name: yup
      .string()
      .min(2, "2글자 이상 입력해주세요.")
      .max(20, "20글자 이내로 입력해주세요.")
      .required("변경하실 이름을 입력해주세요."),
    icon_image_url: yup.string().nullable(),
    publicNickname: yup
      .string()
      .nullable()
      .min(2, "2글자 이상 입력해주세요.")
      .max(20, "20글자 이내로 입력해주세요."),
    secretNickname: yup
      .string()
      .nullable()
      .min(2, "2글자 이상 입력해주세요.")
      .max(20, "20글자 이내로 입력해주세요."),
  })
  .required()

type FormData = yup.InferType<typeof schema>

export default function ProfileCard({ user }: IProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { successToast, errorToast } = useToast()
  const [userProfile, setUserProfile] = useRecoilState(userProfileState)
  const fileUploader = useRef<HTMLInputElement>(null)
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const supabase = useSupabase()
  const auth = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user.name,
      publicNickname: user.publicNickname,
      secretNickname: user.secretNickname,
    },
  })

  const handleProfile = async (payload: FormData) => {
    setIsLoading(true)
    const updateForm: any = {
      userId: user.id,
      name: payload.name,
      iconImageUrl: user.iconImageUrl,
    }
    try {
      if (user.companyCategory) {
        updateForm.publicNickname = payload.publicNickname
        updateForm.secretNickname = payload.secretNickname
      }

      await updateMe(updateForm)
      if (updateForm.publicNickname) {
        setUserProfile({ ...userProfile, name: updateForm.publicNickname })
      }
      successToast("닉네임이 변경되었습니다.")
      queryClient.invalidateQueries(["user", user.id])
    } catch (error: any) {
      errorToast(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileImage = async () => {
    const fileUrls = []

    if (!auth.user) {
      return
    }

    try {
      if (uploadedImages.length > 0) {
        for await (const uploadedImage of uploadedImages) {
          const filename = new Date().getTime().toString()
          const extension = uploadedImage.name.split(".")[1]
          const path = `profiles/${auth.user.id}/${filename}.${extension}`
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
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            icon_image_url: fileUrls[0],
          })
          .eq("id", auth.user.id)

        if (updateError) {
          throw updateError
        }
      }
      successToast("프로필 이미지가 변경되었습니다.")
      setUserProfile({ ...userProfile, userImage: fileUrls[0] })
      queryClient.invalidateQueries(["user", user.id])
    } catch (error: any) {
      successToast(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (uploadedImages.length > 0) {
      handleProfileImage()
    }
  }, [uploadedImages])

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleUploadedFiles = (files: File[]) => {
    setUploadedImages(files)
  }

  return (
    <div className="bg-white p-8 md:rounded-md shadow-md">
      <div className="text-center flex flex-col items-center">
        <div className="relative">
          <img
            className="inline-block h-24 w-24 rounded-full"
            src={user.iconImageUrl || "/img/placeholder_user.png"}
            alt="profile"
          />
          <IconButton
            ripple={false}
            variant="gradient"
            color="blue"
            size="sm"
            className="absolute bottom-1 right-1 text-black rounded-2xl border-2 "
            onClick={openFileUploader}
          >
            <CameraIcon className="w-5 text-white" />
          </IconButton>
          <FileUploader
            ref={fileUploader}
            uploadedFiles={handleUploadedFiles}
          />
        </div>

        <form
          className="flex flex-col mt-2"
          onSubmit={handleSubmit(handleProfile)}
        >
          <div className="flex flex-col items-start gap-2 mb-2">
            <Label
              htmlFor="이름"
              className="whitespace-nowrap mr-2 text-silver"
            >
              이름
            </Label>
            <Input
              {...register("name")}
              type="text"
              maxLength={20}
              disabled
              className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20 disabled:bg-white"
              labelProps={{
                className: "hidden",
              }}
            />
            <ErrorMessage
              errors={errors}
              name="name"
              render={({ message }) => (
                <p className="text-sm text-red-500 mt-1">{message}</p>
              )}
            />
          </div>
          {user.companyCategory && (
            <>
              <div className="flex flex-col items-start gap-2 mb-2">
                <Label
                  htmlFor="publicNickname"
                  className="whitespace-nowrap mr-2 text-silver"
                >
                  공개 닉네임
                </Label>
                <Input
                  {...register("publicNickname")}
                  type="text"
                  maxLength={20}
                  className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                  labelProps={{
                    className: "hidden",
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="publicNickname"
                  render={({ message }) => (
                    <p className="text-sm text-red-500 mt-1">{message}</p>
                  )}
                />
              </div>
              <div className="flex flex-col items-start gap-2 mb-2">
                <Label
                  htmlFor="secretNickname"
                  className="whitespace-nowrap mr-2 text-silver"
                >
                  가상 닉네임
                </Label>
                <Input
                  {...register("secretNickname")}
                  type="text"
                  maxLength={20}
                  className="!border !border-blue-gray-50 bg-white text-blue-gray-500 ring-4 ring-transparent placeholder:text-blue-gray-200 focus:!border-blue-500 focus:!border-t-blue-500 focus:ring-blue-500/20"
                  labelProps={{
                    className: "hidden",
                  }}
                />
                <ErrorMessage
                  errors={errors}
                  name="secretNickname"
                  render={({ message }) => (
                    <p className="text-sm text-red-500 mt-1">{message}</p>
                  )}
                />
              </div>
            </>
          )}
          <p className="text-sm text-silver font-semibold mb-2">
            가상 닉네임은 익명게시판에서 사용되는 닉네임입니다.
          </p>
          <Button
            size="md"
            color="blue"
            variant="text"
            type="submit"
            disabled={!isValid || isLoading}
          >
            저장하기
          </Button>
        </form>
        <div className="text-lg mt-2">{user.email}</div>
        {/* <div className="grid grid-cols-3 mt-10 gap-4">
          <div>
            <div className="text-gray-500 text-lg">글작성</div>
            <div>{user.article_cnt}개</div>
          </div>
          <div>
            <div className="text-gray-500 text-lg">댓글</div>
            <div>{user.comment_cnt}개</div>
          </div>
          <div>
            <div className="text-gray-500 text-lg">좋아요</div>
            <div className="text-gray-500">곧지원예정</div>
          </div>
        </div> */}
      </div>

      {/* <section className="mt-10"> */}
      {/*  <div className="border border-gray-400 p-6 mb-4"> */}
      {/*    <div className="text-xl font-semi-bold">소개</div> */}
      {/*    <div>{user.intro}</div> */}
      {/*  </div> */}
      {/*  <div className="border border-gray-400 p-6 mb-4"> */}
      {/*    <div className="text-xl font-semi-bold">전공</div> */}
      {/*    <div>{(MAJOR_CATEGORY_ITEMS as any)[user.major]}</div> */}
      {/*  </div> */}
      {/*  <div className="border border-gray-400 p-6 mb-4"> */}
      {/*    <div className="text-xl font-semi-bold">학교</div> */}
      {/*    {user.school?.map((el, index) => { */}
      {/*      const degree = Object.keys(el)[0] */}
      {/*      const schoolName = el[degree] */}
      {/*      return ( */}
      {/*        <div key={index}> */}
      {/*          <span className="font-bold">{degree}:</span> {schoolName} */}
      {/*        </div> */}
      {/*      ) */}
      {/*    })} */}
      {/*  </div> */}
      {/* </section> */}
    </div>
  )
}
