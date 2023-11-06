"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { deleteJob, fetchJob } from "@/app/Api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isMobileWeb } from "@toss/utils"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import useAuth from "@/hooks/useAuth"
import { TrashIcon } from "@heroicons/react/24/outline"
import { Modal } from "@/components/common/Modal"
import useToast from "@/hooks/useToast"

const ScrollButtonWrap = dynamic(
  () => import("@/components/ui/Button/ScrollButtonWrap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  },
)

interface IProps {
  jobId: number
}

export default function JobDetailContainer({ jobId }: IProps) {
  const router = useRouter()
  const isMobile = isMobileWeb()
  const [isIPhone, setIsIPhone] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useAuth()
  const { errorToast, successToast } = useToast()
  const queryClient = useQueryClient()

  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    suspense: true,
    queryFn: () => fetchJob(jobId),
  })

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

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => {
      return deleteJob(feedId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.replace("/jobs")
      queryClient.invalidateQueries(["recruit_jobs"])
      successToast("채용 게시글이 삭제되었습니다.")
    },
  })

  const handleDeleteJob = () => {
    setIsOpenModal(false)
    if (job?.id) {
      deleteFeedMutation.mutate(job.id)
    } else {
      errorToast("삭제할 수 없습니다.")
    }
  }

  return (
    <div className="sm:container mx-auto mt-4 relative pb-10 px-4 h-screen">
      {/* <Element id="top" /> */}
      <div className="flex" id="top">
        <div className="flex-1">
          <div className="w-full h-[200px] md:w-2/5 md:mx-auto md:h-[300px]  overflow-hidden relative">
            {job?.company_image_url?.length && (
              <Image
                src={job?.company_image_url}
                alt="company_image"
                fill
                quality={100}
                sizes="(max-width: 480px) 800px, (max-width: 1200px) 1200px, 400px"
              />
            )}
          </div>

          <section className="my-6">
            <h2 className="text-3xl font-semi-bold mb-2 break-keep">
              {job?.title}
            </h2>
            <div className="flex items-center">
              <div className="text-xl mr-2">{job?.company_name}</div>
            </div>
          </section>
          {job?.contents && (
            <div
              className="w-10/12 mx-auto"
              dangerouslySetInnerHTML={{ __html: job.contents }}
            />
          )}
        </div>
      </div>
      {!isMobile && (
        <div className="flex flex-col text-white">
          <button
            className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 mr-2"
            onClick={() => router.back()}
          >
            뒤로가기
          </button>
          {job?.link_url && (
            <Link
              className="mt-4  transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              href={job?.link_url}
              target="_blank"
            >
              공고 바로가기
            </Link>
          )}
        </div>
      )}
      {isMobile && job?.link_url && (
        <div
          className={`w-full flex fixed ${
            isIPhone ? "bottom-20" : "bottom-16"
          } left-0 h-14
          bg-indigo-600
          `}
        >
          {user?.id === job?.profile_id && (
            <button
              className="text-white px-3 "
              onClick={() => setIsOpenModal(true)}
            >
              <TrashIcon className="w-9 border-r border-white pr-3" />
            </button>
          )}

          <Link
            className="flex-1 transition ease-in-out duration-150 
           inline-flex items-center w-full justify-center text-md pt-1 leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 text-white"
            href={job?.link_url}
            target="_blank"
          >
            공고 바로가기
          </Link>
        </div>
      )}
      {isMobile && <ScrollButtonWrap handleScroll={handleScroll} list="jobs" />}

      <Modal
        title="채용 글 삭제"
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
            onClick={handleDeleteJob}
          >
            확인
          </button>
        </div>
      </Modal>
    </div>
  )
}
