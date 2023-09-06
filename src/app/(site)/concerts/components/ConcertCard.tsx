"use client"

import useFilters from "@/hooks/useFilters"
import Image from "next/image"

interface IProps {
  item: {
    id: number
    title: string
    poster_url: string | null
    location: string
    performance_time: string
    created_at: string
    profiles: {
      id: string
      name: string
    } | null
  }
}

export default function ConcertCard({ item }: IProps) {
  const filters = useFilters()
  const date = filters.DIFF_FROM_NOW_ADD_TIME(
    item.performance_time,
    "YYYY-MM-DD(ddd) a h:mm",
  )
  return (
    <div className="card flex flex-col bg-zinc-900 rounded-md">
      <div className=" relative h-[380px]">
        {item.poster_url && (
          <Image
            src={`${item.poster_url}`}
            alt="concert_image"
            // placeholder="blur"
            // blurDataURL="/img/placeholder_user.png"
            sizes="276px, 150px"
            fill
            className="transition ease delay-100 "
          />
        )}
      </div>
      <div className="px-4 py-2 flex flex-col flex-1">
        <div className="flex-1">
          <div className="mt-2 mb-1 text-sm font-semibold">{item.title}</div>
          <div className="text-sm mt-2">{item.location}</div>
        </div>
        <div className="text-sm">{date}</div>
      </div>
    </div>
  )
}
