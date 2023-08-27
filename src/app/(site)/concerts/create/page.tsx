"use client"

import FileUploader from "@/components/ui/FileUploader"
import { InputCounter } from "@/components/ui/InputCounter"
import { ResizteTextArea } from "@/components/ui/ResizteTextArea"
import useAuth from "@/hooks/useAuth"
import useSupabase from "@/hooks/useSupabase"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Button, IconButton, Option, Select } from "@material-tailwind/react"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import React, { useRef, useState } from "react"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const QuillEditor = dynamic(
  () => import("@/components/ui/Editor/QuillEditor"),
  {
    loading: () => <div>...loading</div>,
    ssr: false,
  },
)

const items = [
  { title: "합창", value: "CHORUS" },
  { title: "앙상블", value: "ENSEMBLE" },
  { title: "오케스트라", value: "ORCHESTRA" },
  { title: "솔로", value: "SOLO" },
  { title: "기타", value: "ETC" },
]

const page = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useSupabase()
  const [uploadedImage, setUploadedImage] = useState<File>()
  const fileUploader = useRef<HTMLInputElement>(null)
  const [selectedType, setSelectedType] = useState("CHORUS")
  const router = useRouter()
  const [startedAt, setStartedAt] = useState("")
  const [htmlStr, setHtmlStr] = useState<string>("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const quillRef = useRef()

  // const uploadedImageUrl = uploadedImage && URL.createObjectURL(uploadedImage)

  const handleUploadedFiles = (files: File[]) => {
    const file = files[0]
    setUploadedImage(file)
    setUploadedImageUrl(URL.createObjectURL(file))
  }

  const openFileUploader = () => {
    fileUploader.current?.click()
  }

  const isValidForm =
    location?.length >= 5 && (title.length ? title.length >= 5 : true)

  const handleCreateConcert = async () => {
    if (!user) {
      return
    }
    setIsLoading(true)

    try {
      const formData = {
        profile_id: user.id,
        poster_url: null,
        performance_time: startedAt,
        title,
        contents: htmlStr,
        location,
        category: selectedType as
          | "ORCHESTRA"
          | "CHORUS"
          | "ENSEMBLE"
          | "SOLO"
          | "ETC",
      }
      console.log("##", formData)
      const { data, error } = await supabase
        .from("concerts")
        .insert({ ...formData })
        .select("id")
        .single()

      if (error) {
        throw error
      }

      // upload file
      const concertId = data.id
      if (uploadedImage && concertId) {
        // const filename = uploadedImage.name
        const filename = new Date().getTime().toString()
        const extension = uploadedImage.name.split(".")[1]
        const path = `concerts/${concertId}/${filename}.${extension}`
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
        console.log(fileUrl)

        const { error: updateError } = await supabase
          .from("concerts")
          .update({
            poster_url: fileUrl,
          })
          .eq("id", concertId)

        if (updateError) {
          throw updateError
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["concerts"] })

      console.log("SUCCESS!")
      router.replace("/concerts")
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="text-left text-2xl my-12 font-semibold">공연 등록</div>

      <form className="w-3/4">
        <div className="w-20 mb-5">
          <Select
            variant="static"
            label="공연 유형을 선택해주세요."
            value={selectedType}
            onChange={() => setSelectedType(selectedType)}
          >
            {items.map(item => (
              <Option key={item.value}>{item.title}</Option>
            ))}
          </Select>
        </div>

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
        <div className="mt-8 flex-1 overflow-y-auto">
          <InputCounter
            currentLength={title?.length || 0}
            maxLength={50}
            className="text-right"
          >
            <ResizteTextArea
              value={location}
              maxLength={1000}
              placeholder="장소를 입력해주세요(필수)"
              className="md:text-xl"
              onChange={value => setLocation(value)}
            />
          </InputCounter>

          <div className="my-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DateTimePicker"]}>
                <DateTimePicker
                  label="공연 시간을 설정해주세요."
                  className="py-2"
                  onChange={(newValue: any) => setStartedAt(newValue.$d)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>

          {/* <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} /> */}
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
          <div>
            <div className="flex w-full items-center justify-between border-t py-4 gap-x-2">
              <div>
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
                <span className="text-sm">대표사진 업로드</span>
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
                  className="rounded-md bg-indigo-500 w-full md:w-32"
                  onClick={handleCreateConcert}
                >
                  등록하기
                </Button>
              </div>
            </div>
          </div>
        </div>
        <FileUploader ref={fileUploader} uploadedFiles={handleUploadedFiles} />
      </form>
    </div>
  )
}

export default page
