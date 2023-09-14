"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { EyeIcon, ClockIcon, ShareIcon } from "@heroicons/react/20/solid"
import useFilters from "@/hooks/useFilters"
import { fetchConcert } from "@/app/Api"
import dynamic from "next/dynamic"
import { isMobileWeb } from "@toss/utils"

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
  const { data: concert } = useQuery({
    queryKey: ["concert", pageId],
    suspense: true,
    queryFn: () => fetchConcert(pageId),
  })

  const isMobile = isMobileWeb()

  const filters = useFilters()

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
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

      {isMobile && (
        <ScrollButtonWrap handleScroll={handleScroll} list="concerts" />
      )}
    </div>
  )
}
