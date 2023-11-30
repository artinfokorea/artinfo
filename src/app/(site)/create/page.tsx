"use client"

import { useAuth } from "@/components/ui/Auth/AuthProvider"
import { Button, IconButton } from "@/components/material"
import FileUploader from "@/components/common/FileUploader"
import { InputCounter } from "@/components/common/InputCounter"
import { ResizteTextArea } from "@/components/common/ResizteTextArea"
import useSupabase from "@/hooks/useSupabase"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { getArtist } from "@/apis/artist"
import Image from "next/image"

export default function CreatePost() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()
  const supabase = useSupabase()
  const [isLoading, setIsLoading] = useState(false)
  const [category, setCategory] = useState<
    "RECRUIT" | "INFORMATION" | "REVIEW" | "QUESTION"
  >()
  const [title, setTitle] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [uploadedImages, setUploadedImages] = useState<File[]>([])
  const fileUploader = useRef<HTMLInputElement>(null)
  const searchParams = useSearchParams()
  const artistId = searchParams.get("artistId")

  const { data: artist } = useQuery({
    queryKey: ["artist", artistId],
    suspense: false,
    enabled: !!artistId,
    queryFn: () => getArtist(Number(artistId)),
  })

  const handleUploadedFiles = (files: File[]) => {
    setUploadedImages(files)
  }

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const handleCreatePost = async () => {
    if (!user) {
      return
    }
    setIsLoading(true)

    try {
      const formData: any = {
        profile_id: user.id,
        title,
        content,
      }
      if (artistId) {
        formData.artist_id = artistId
      } else {
        formData.category = category
      }
      const { data, error } = await supabase
        .from("feeds")
        .insert({ ...formData })
        .select("id")
        .single()

      if (error) {
        throw error
      }

      // upload file
      const postId = data.id

      if (uploadedImages.length > 0 && postId) {
        const fileUrls: string[] = []

        for await (const uploadedImage of uploadedImages) {
          const filename = new Date().getTime().toString()
          const extension = uploadedImage.name.split(".")[1]
          const path = `posts/${postId}/${filename}.${extension}`
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

        const { error: updateError, data: updateData } = await supabase
          .from("feeds")
          .update({
            image_urls: fileUrls,
          })
          .eq("id", postId)

        if (updateError) {
          throw updateError
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["feeds"] })

      console.log("SUCCESS!")
      router.replace("/")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidForm =
    content?.length >= 1 && (title.length ? title.length >= 3 : true)

  const tags = [
    { title: "정보", value: "INFORMATION" },
    { title: "공연후기", value: "REVIEW" },
    { title: "질문", value: "QUESTION" },
    { title: "구인", value: "RECRUIT" },
  ]

  const uploadedImageUrls = useMemo(() => {
    const urls: string[] = []
    uploadedImages.forEach(uploadedImage => {
      urls.push(URL.createObjectURL(uploadedImage))
    })
    return urls
  }, [uploadedImages])

  const deleteImage = async (index: number) => {
    // const blob = await fetch(url).then(response => response.blob())
    // const newUrls = uploadedImages.filter(uploadedImage => {
    //   console.log("blob", blob)

    //   return uploadedImages !== blob
    // })
    // console.log("newUrls", newUrls)
    // setUploadedImages(newUrls)
    // 비교할 URL을 Blob으로 가져옵니다.

    const newUploadedImages = [...uploadedImages]
    newUploadedImages.splice(index, 1)

    setUploadedImages(newUploadedImages)
  }

  // useEffect(() => {
  //   if (!user) router.replace("/auth")
  // }, [])

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
            글 작성하기
          </h2>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden mt-4">
          {artist ? (
            <div className="py-4 mb-2 border-t border-gray-300">
              <div className="flex flex-wrap gap-2 mt-2">
                <Button className="rounded-full" size="md" variant="filled">
                  {artist.koreanName}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-4 border-t border-gray-300">
              <span className="text-xl font-medium text-darkgrey">
                태그선택
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(ctag => (
                  <Button
                    key={ctag.title}
                    className="rounded-full"
                    size="sm"
                    variant={category === ctag.value ? "filled" : "outlined"}
                    onClick={() => setCategory(ctag.value as any)}
                  >
                    {ctag.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="pb-2 border-b border-gray-300">
            <InputCounter
              currentLength={title?.length || 0}
              maxLength={50}
              className="text-right"
            >
              <ResizteTextArea
                value={title}
                maxRows={5}
                maxLength={50}
                placeholder="제목을 입력해주세요(선택사항: 입력시 5글자 이상)"
                className="md:text-2xl"
                onChange={value => setTitle(value)}
              />
            </InputCounter>
          </div>
          <div className="mt-8 flex-1 overflow-y-auto relative">
            <ResizteTextArea
              value={content}
              maxLength={1000}
              placeholder="내용을 작성해주세요(필수)"
              className="md:text-xl "
              onChange={value => setContent(value)}
            />
          </div>
          {uploadedImageUrls.length > 0 && (
            <div className="overflow-x-auto h-[200px]">
              <Swiper
                spaceBetween={10}
                slidesPerView="auto"
                modules={[Pagination]}
              >
                {uploadedImageUrls?.map((uploadedImageUrl, index) => (
                  <SwiperSlide key={uploadedImageUrl} style={{ width: 180 }}>
                    <div
                      className="relative bg-gray-300"
                      key={uploadedImageUrl}
                    >
                      <img
                        src={uploadedImageUrl}
                        alt="community-write-img"
                        className="w-[200px] h-[200px]"
                      />
                      <button
                        className="absolute right-2 top-2 text-red  bg-gray-600 rounded-full p-1"
                        onClick={() => deleteImage(index)}
                      >
                        <XMarkIcon className="w-5" />
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
          <div>
            <InputCounter
              currentLength={content?.length || 0}
              maxLength={1000}
              className="text-right mb-1"
            />
            <div className="flex w-full items-center justify-between border-t py-4 gap-x-2">
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
                <span className="text-primary break-words">
                  사진은 최대 5장까지 등록가능합니다.
                </span>
              </div>
              <div className="flex gap-2 flex-1 md:flex-none">
                <Link href="/posts">
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
                  disabled={!isValidForm || isLoading}
                  size="lg"
                  className=" rounded-md bg-indigo-500 w-full md:w-32 whitespace-nowrap"
                  onClick={handleCreatePost}
                >
                  등록하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FileUploader
        ref={fileUploader}
        uploadedFiles={handleUploadedFiles}
        multiple
      />
    </div>
  )
}
