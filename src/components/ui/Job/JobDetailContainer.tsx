"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isMobileWeb } from "@toss/utils"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import useAuth from "@/hooks/useAuth"
import { TrashIcon } from "@heroicons/react/24/outline"
import { Modal } from "@/components/common/Modal"
import useToast from "@/hooks/useToast"
import { Dialog } from "@headlessui/react"
import { deleteJob, getJob } from "@/apis/job"
import JobCreateForm from "./JobCreateForm"

const ScrollButtonWrap = dynamic(
  () => import("@/components/ui/Button/ScrollButtonWrap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  },
)

const adminId = process.env.NEXT_PUBLIC_ADMIN_ID
interface IProps {
  jobId: number
}

export default function JobDetailContainer({ jobId }: IProps) {
  const router = useRouter()
  const [pageType, setPageType] = useState<"read" | "update">("read")
  const isMobile = isMobileWeb()
  const [isIPhone, setIsIPhone] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useAuth()
  const { errorToast, successToast } = useToast()
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)

  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    suspense: true,
    queryFn: () => getJob(jobId, "CSR"),
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
    if (!user) setIsOpen(true)
  }, [user])

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

  const handleDeleteJob = async () => {
    setIsOpenModal(false)

    if (!job?.id) return

    try {
      await deleteJob(job.id)
      router.replace("/jobs")
      queryClient.invalidateQueries(["recruit_jobs"])
      successToast("채용 게시글이 삭제되었습니다.")
    } catch (error) {
      console.log("error", error)
      errorToast("삭제할 수 없습니다.")
    }
  }

  const goToLogin = () => {
    router.push("/auth")
  }

  return (
    <div>
      {pageType === "read" ? (
        <div className="sm:container mx-auto mt-4 relative  px-4 z-10 mb-40 md:mb-0">
          <div className="flex md:min-h-[1000px]" id="top">
            <div className="flex-1">
              <div className="w-full h-[200px] md:w-2/5 md:mx-auto md:h-[300px]  overflow-hidden relative">
                {job?.companyImageUrl?.length && (
                  <Image
                    src={job?.companyImageUrl}
                    alt="company_image"
                    fill
                    quality={100}
                    sizes="(max-width: 480px) 800px, (max-width: 1200px) 1200px, 400px"
                  />
                )}
              </div>

              <section className="my-6">
                <div className="flex justify-between">
                  <h2 className="text-3xl font-semi-bold mb-2 break-words">
                    {job?.title}
                  </h2>

                  {(job?.userId === user?.id || user?.id === adminId) && (
                    <div className="flex ml-2 mb-auto">
                      <button
                        className="mr-2"
                        onClick={() => setPageType("update")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 md:w-9 md:h-9"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </button>
                      <button onClick={() => setIsOpenModal(true)}>
                        <TrashIcon className="w-9 md:w-12 h-9 border-r border-white pr-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <div className="text-xl mr-2">{job?.companyName}</div>
                </div>
              </section>
              {job?.contents && (
                <div
                  className="w-10/12 mx-auto editor_view"
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
              {job?.linkUrl && (
                <Link
                  className="mt-4  transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                  href={job?.linkUrl}
                  target="_blank"
                >
                  공고 바로가기
                </Link>
              )}
            </div>
          )}
          {isMobile && job?.linkUrl && (
            <div
              className={`w-full flex fixed ${
                isIPhone ? "bottom-20" : "bottom-16"
              } left-0 h-14
         bg-indigo-600
         `}
            >
              {/* {user?.id === job?.userId && (
                <button
                  className="text-white px-3 "
                  onClick={() => setIsOpenModal(true)}
                >
                  <TrashIcon className="w-9 border-r border-white pr-3" />
                </button>
              )} */}

              <Link
                className="flex-1 transition ease-in-out duration-150 
          inline-flex items-center w-full justify-center text-md pt-1 leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 text-white"
                href={job?.linkUrl}
                target="_blank"
              >
                공고 바로가기
              </Link>
            </div>
          )}
          {isMobile && (
            <ScrollButtonWrap handleScroll={handleScroll} list="jobs" />
          )}

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
          <Modal
            title="로그인이 필요합니다."
            isOpen={isOpen}
            closeModal={goToLogin}
          >
            <div className="mt-2">
              <p className="text-sm text-gray-500 font-medium">
                해당 페이지는 로그인 후 확인하실수 있습니다.
                <br />
                로그인 후 이용해주세요.
              </p>
            </div>

            <div className="mt-4 flex items-end justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                onClick={goToLogin}
              >
                확인
              </button>
            </div>
          </Modal>

          {/* <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className="bg-white"
          >
            <Dialog.Panel className="p-4">
              <Dialog.Title>Deactivate account</Dialog.Title>
              <Dialog.Description>
                This will permanently deactivate your account
              </Dialog.Description>

              <p>
                Are you sure you want to deactivate your account? All of your
                data will be permanently removed. This action cannot be undone.
              </p>

              <button onClick={() => setIsOpen(false)}>Deactivate</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </Dialog.Panel>
          </Dialog> */}
        </div>
      ) : (
        <JobCreateForm type={pageType} job={job} />
      )}
    </div>
  )
}
