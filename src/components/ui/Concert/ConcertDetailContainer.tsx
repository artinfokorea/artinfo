"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { ClockIcon, ShareIcon, TrashIcon } from "@heroicons/react/20/solid"
import useFilters from "@/hooks/useFilters"
import { deleteConcert, fetchConcert } from "@/app/Api"
import dynamic from "next/dynamic"
import { isMobileWeb, clipboard } from "@toss/utils"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import useAuth from "@/hooks/useAuth"
import { Modal } from "@/components/common/Modal"
import useToast from "@/hooks/useToast"
import { useRouter } from "next/navigation"
import ConcertForm from "./ConcertForm"

const ScrollButtonWrap = dynamic(
  () => import("@/components/ui/Button/ScrollButtonWrap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  },
)

interface IProps {
  pageId: number
}

export default function ConcertDetailContainer({ pageId }: IProps) {
  const [isIPhone, setIsIPhone] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { errorToast, successToast } = useToast()
  const queryClient = useQueryClient()
  const [pageType, setPageType] = useState<"read" | "update">("read")

  const { data: concert } = useQuery({
    queryKey: ["concert", pageId],
    suspense: true,
    queryFn: () => fetchConcert(pageId),
  })

  const isMobile = isMobileWeb()
  const { user } = useAuth()
  const filters = useFilters()
  const router = useRouter()

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf("iphone") > -1) {
      setIsIPhone(true)
    }
  }, [])

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }
  const deleteFeedMutation = useMutation({
    mutationFn: (concertId: number) => {
      return deleteConcert(concertId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.replace("/concerts")
      queryClient.invalidateQueries(["concerts"])
      successToast("댓글이 삭제되었습니다.")
    },
  })

  const handleDeleteConcert = () => {
    setIsOpenModal(true)
    if (concert?.id) {
      deleteFeedMutation.mutate(concert.id)
    } else {
      errorToast("삭제할 수 없습니다.")
    }
  }

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}/concerts/${concert?.id}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      successToast("공유할 공연 URL을 클립보드에 복사했어요!")
    }
  }

  const goToBack = () => {
    const storage = globalThis?.sessionStorage
    if (storage) {
      const link = storage.getItem("currentPath") || "/"
      if (link.includes("/artists")) {
        router.back()
      } else {
        router.replace("/concerts")
      }
    }
  }

  return (
    <div className="">
      {pageType === "read" ? (
        <div className="sm:container mx-auto">
          <h2 className="text-2xl font-semi-bold px-2" id="top">
            {concert?.title}
          </h2>

          <div className="flex items-center gap-x-2 my-6 px-2">
            {concert?.profiles?.icon_image_url && (
              <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <Image
                  src={concert?.profiles?.icon_image_url}
                  alt="user_image"
                  fill
                  quality={100}
                  sizes="100px"
                />
              </div>
            )}

            <div className="text-sm">
              <div>{concert?.profiles?.name}</div>
              <div className="text-xs">{concert?.profiles?.email}</div>
            </div>
          </div>

          <div className="flex border-t border-b border-gray-600 py-3 px-2">
            <div className="flex flex-1 items-center gap-x-4">
              <div className="flex items-center">
                <ClockIcon className="w-5 mr-1" />
                <span className="text-sm">
                  {filters.DIFF_FROM_NOW_ADD_TIME(
                    concert?.performance_time,
                    "YYYY-MM-DD HH:mm",
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center">
              {concert?.profile_id === user?.id && (
                <button className="mr-2" onClick={() => setPageType("update")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              )}
              {concert?.profile_id === user?.id && (
                <button className="mr-2" onClick={() => setIsOpenModal(true)}>
                  <TrashIcon className="w-5  " />
                </button>
              )}

              <button onClick={handleCopyClipboard}>
                <ShareIcon className="w-5" />
              </button>
            </div>
          </div>

          {pageType === "read" && (
            <section className="mt-10 pb-20">
              {concert?.contents && (
                <div
                  className="w-10/12 mx-auto"
                  dangerouslySetInnerHTML={{ __html: concert.contents }}
                />
              )}
            </section>
          )}

          {!isMobile && (
            <div className="flex flex-col text-white mb-4">
              <button
                className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50 mr-2"
                onClick={goToBack}
              >
                뒤로가기
              </button>
              {concert?.link_url && (
                <Link
                  className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50"
                  href={concert?.link_url}
                  target="_blank"
                >
                  공연 바로가기
                </Link>
              )}
            </div>
          )}
          {isMobile && concert?.link_url && (
            <div
              className={`w-full flex fixed ${
                isIPhone ? "bottom-20" : "bottom-16"
              } left-0 h-14
          bg-indigo-600
          `}
            >
              {user?.id === concert?.profile_id && (
                <button
                  className="text-white px-3 "
                  onClick={() => setIsOpenModal(true)}
                >
                  <TrashIcon className="w-9 border-r border-white pr-3" />
                </button>
              )}
              <button
                className={`${user?.id !== concert?.profile_id && "px-3"}`}
                onClick={handleCopyClipboard}
              >
                <ShareIcon className="w-9 border-r text-white pr-3" />
              </button>

              <Link
                className="flex-1 transition ease-in-out duration-150 
           inline-flex items-center w-full justify-center text-md pt-1 leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 text-white "
                href={concert?.link_url}
                target="_blank"
              >
                공연 바로가기
              </Link>
            </div>
          )}
          {isMobile && (
            <ScrollButtonWrap
              handleScroll={handleScroll}
              list="concerts"
              goToBack={goToBack}
            />
          )}

          <Modal
            title="공연 글 삭제"
            isOpen={isOpenModal}
            closeModal={() => setIsOpenModal(false)}
          >
            <div className="mt-2">
              <p className="text-sm text-gray-500">정말 삭제하시겠습니까?</p>
            </div>

            <div className="mt-4 flex items-end justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-red-300 text-white px-4 py-2 text-sm font-medium  hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
                onClick={() => setIsOpenModal(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={handleDeleteConcert}
              >
                확인
              </button>
            </div>
          </Modal>
        </div>
      ) : (
        <ConcertForm type="update" concert={concert} />
      )}
    </div>
  )
}
