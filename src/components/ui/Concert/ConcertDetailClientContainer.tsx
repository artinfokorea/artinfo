"use client"

import { CONCERT } from "@/types/types"
import { isMobileWeb, clipboard } from "@toss/utils"
import React, { useEffect, useState } from "react"
import { Modal } from "@/components/common/Modal"
import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShareIcon, TrashIcon } from "@heroicons/react/20/solid"
import useAuth from "@/hooks/useAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteConcert } from "@/app/Api"
import useToast from "@/hooks/useToast"

const ScrollButtonWrap = dynamic(
  () => import("@/components/ui/Button/ScrollButtonWrap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  },
)

interface Props {
  children: React.ReactNode
  concert: CONCERT
}

const ConcertDetailClientContainer = ({ children, concert }: Props) => {
  const isMobile = isMobileWeb()
  const [isIPhone, setIsIPhone] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { successToast, errorToast } = useToast()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const listPath = pathname.slice(0, pathname.lastIndexOf("/"))

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf("iphone") > -1) {
      setIsIPhone(true)
    }
  }, [])

  const goToBack = () => router.push(listPath)

  const deleteConcertMutaion = useMutation({
    mutationFn: (concertId: number) => {
      return deleteConcert(concertId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.push(listPath)
      queryClient.invalidateQueries()
      successToast("공연이 삭제되었습니다.")
    },
  })

  const handleDeleteConcert = () => {
    setIsOpenModal(true)
    if (concert?.id) {
      deleteConcertMutaion.mutate(concert.id)
    } else {
      errorToast("삭제할 수 없습니다.")
    }
  }

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}${pathname}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      successToast("공유할 공연 URL을 클립보드에 복사했어요!")
    }
  }

  return (
    <>
      {children}
      {!isMobile && (
        <div className="flex flex-col text-white pb-8 px-8">
          <button
            className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50 mr-2"
            onClick={goToBack}
          >
            뒤로가기
          </button>
          {concert?.linkUrl && (
            <Link
              className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50"
              href={concert?.linkUrl}
              target="_blank"
            >
              공연 바로가기
            </Link>
          )}
        </div>
      )}
      {isMobile && concert?.linkUrl && (
        <div
          className={`w-full flex fixed ${
            isIPhone ? "bottom-20" : "bottom-16"
          } left-0 h-14
          bg-indigo-600
          `}
        >
          {user?.id === concert?.authorId && (
            <button
              className="text-white px-3 "
              onClick={() => setIsOpenModal(true)}
            >
              <TrashIcon className="w-9 border-r border-white pr-3" />
            </button>
          )}
          <button
            className={`${user?.id !== concert?.authorId && "px-3"}`}
            onClick={handleCopyClipboard}
          >
            <ShareIcon className="w-9 border-r text-white pr-3" />
          </button>

          <Link
            className="flex-1 transition ease-in-out duration-150 
           inline-flex items-center w-full justify-center text-md pt-1 leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 text-white "
            href={concert?.linkUrl}
            target="_blank"
          >
            공연 바로가기
          </Link>
        </div>
      )}

      {isMobile && (
        <ScrollButtonWrap handleScroll={handleScroll} goToBack={goToBack} />
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
    </>
  )
}

export default ConcertDetailClientContainer
