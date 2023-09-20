"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { ClockIcon, ShareIcon, TrashIcon } from "@heroicons/react/20/solid"
import useFilters from "@/hooks/useFilters"
import { deleteConcert, fetchConcert } from "@/app/Api"
import dynamic from "next/dynamic"
import { isMobileWeb } from "@toss/utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import useAuth from "@/hooks/useAuth"
import { Modal } from "@/components/ui/Modal"
import useToast from "@/hooks/useToast"
import { Toaster } from "react-hot-toast"
import { useRouter } from "next/navigation"

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

export default function Container({ pageId }: IProps) {
  const [isIPhone, setIsIPhone] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { errorToast, successToast } = useToast()
  const queryClient = useQueryClient()

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
    setIsOpenModal(false)
    if (concert?.id) {
      deleteFeedMutation.mutate(concert.id)
    } else {
      errorToast("삭제할 수 없습니다.")
    }
  }

  return (
    <div className="sm:container mx-auto mt-4">
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
              {filters.YYYYMMDD(concert?.created_at, "YYYY.MM.DD HH:mm")}
            </span>
          </div>
        </div>

        <div className="flex items-center">
          <button>
            <ShareIcon className="w-5 mr-1" />
          </button>
        </div>
      </div>

      <section className="mt-10">
        {concert?.contents && (
          <div
            className="w-10/12 mx-auto"
            dangerouslySetInnerHTML={{ __html: concert.contents }}
          />
        )}
      </section>
      {!isMobile && (
        <div className="flex flex-col text-white mb-4">
          <button className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50 mr-2">
            뒤로가기
          </button>
          {concert?.link_url && (
            <Link
              className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 rounded-md disabled:opacity-50"
              href={concert?.link_url}
              target="_blank"
            >
              공고 바로가기
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

          <Link
            className="flex-1 transition ease-in-out duration-150 
           inline-flex items-center w-full justify-center text-md pt-1 leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 text-white "
            href={concert?.link_url}
            target="_blank"
          >
            공고 바로가기
          </Link>
        </div>
      )}
      {isMobile && (
        <ScrollButtonWrap handleScroll={handleScroll} list="concerts" />
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
      <Toaster />
    </div>
  )
}
