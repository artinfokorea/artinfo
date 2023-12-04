"use client"

import useFilters from "@/hooks/useFilters"
import { CONCERT } from "@/types/types"
import { Spinner } from "@material-tailwind/react"
import Image from "next/image"
import { useState } from "react"

interface IProps {
  item: CONCERT
}

export default function ConcertCard({ item }: IProps) {
  const filters = useFilters()
  const [isLoading, setIsLoading] = useState(true)
  const date = filters.DIFF_FROM_NOW_ADD_TIME(
    item.performanceTime,
    "YYYY-MM-DD(ddd) a h:mm",
  )

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="card flex flex-col bg-zinc-900 rounded-md">
      <div className="relative h-[220px] lg:h-[300px]">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {item.posterUrl && (
          <Image
            src={item.posterUrl}
            alt="concert_image"
            sizes="250px, 250px"
            fill
            priority
            quality={100}
            onLoad={handleImageLoad}
            className="rounded-md"
          />
        )}
      </div>
      <div className="py-1 flex flex-col break-keep">
        <div className="flex-1">
          <div className="mt-2 mb-1 text-sm font-semibold lg:text-base">
            {item.title}
          </div>
          <div className="text-sm mt-2 mb-1">{item.location}</div>
        </div>
        <div className="text-sm text-darkgrey opacity-75">{date}</div>
      </div>
    </div>
  )
}
