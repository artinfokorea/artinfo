import useFilters from "@/hooks/useFilters"
import Image from "next/image"
import { useRouter } from "next/router"
import React from "react"

interface Props {
  concert: {
    id: number
    title: string
    location: string
    performanceTime: string
    isActive: boolean
  }
  isAdmin?: boolean
}

const ArtistConcertCard = ({ concert, isAdmin }: Props) => {
  const filters = useFilters()
  const router = useRouter()

  const goToConcertEdit = () =>
    router.push(`/concerts/${concert.id}?type=update`)

  return (
    <section className="card flex p-4 my-1 bg-white">
      <div className="flex flex-1 justify-between">
        <div className="flex flex-col  mx-4 text-primary justify-center">
          <span className="font-semibold break-keep">{concert.title}</span>
          <span className="text-xs">{concert.location}</span>
        </div>
        {isAdmin && (
          <button className="mr-2" onClick={goToConcertEdit}>
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
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center flex-col justify-center ">
        <span className="opacity-70">
          {filters.YYYYMMDD(concert.performanceTime)}
        </span>
        {concert.isActive && (
          <span className="bg-[#f8f8f9] px-2 py-1 rounded-2xl font-semibold">
            바로가기
          </span>
        )}
      </div>
    </section>
  )
}

export default ArtistConcertCard
