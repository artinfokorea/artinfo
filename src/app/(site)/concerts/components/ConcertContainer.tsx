"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Link from "next/link"
import { fetchConcerts } from "@/app/Api"
import ConcertCard from "./ConcertCard"
import ConcertCategory from "./ConcertCategory"

export default function ConcertContainer() {
  const [category, selectCategory] = useState("ALL")

  const { data } = useQuery({
    queryKey: ["concerts", category],
    suspense: false,
    queryFn: () => fetchConcerts(category === "ALL" ? undefined : category),
  })

  const updatedCategory = (_category: string) => {
    selectCategory(_category)
  }

  return (
    <div>
      <div className="mb-4 flex align-center justify-between">
        <ConcertCategory
          category={category}
          updatedCategory={updatedCategory}
        />
        <div className="flex items-center bg-[#3e51b5] rounded-2xl w-15 h-8 p-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-5 h-5 mr-1"
          >
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
          </svg>

          <Link href="/concerts/create">
            <span className="text-white whitespace-nowrap">등록</span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map(item => (
          <Link key={item.id} href={`/concerts/${item.id}`}>
            <ConcertCard item={item} />
          </Link>
        ))}
      </div>
    </div>
  )
}
