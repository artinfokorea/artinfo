"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { fetchJob } from "@/app/Api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isMobileWeb } from "@toss/utils"
import dynamic from "next/dynamic"

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

export default function Container({ jobId }: IProps) {
  const router = useRouter()
  const isMobile = isMobileWeb()

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

  return (
    <div className="sm:container mx-auto mt-4 relative pb-10 px-4">
      {/* <Element id="top" /> */}
      <div className="flex" id="top">
        <div className="flex-1">
          <div className="w-full overflow-hidden relative">
            {job?.company_image_url?.length && (
              <Image
                src={job?.company_image_url}
                alt="아트인포"
                layout="responsive"
                sizes="(max-width: 480px) 800px, (max-width: 1200px) 1200px, 400px"
                width={1200}
                height={400}
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
        <Link
          className="
          fixed bottom-20 left-0
          transition ease-in-out duration-150 inline-flex items-center w-full justify-center  bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          href={job?.link_url}
          target="_blank"
        >
          공고 바로가기
        </Link>
      )}
      {isMobile && <ScrollButtonWrap handleScroll={handleScroll} list="jobs" />}
    </div>
  )
}
