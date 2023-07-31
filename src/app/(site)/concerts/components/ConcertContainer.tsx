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
      <div className="mb-4 flex align-center">
        <ConcertCategory
          category={category}
          updatedCategory={updatedCategory}
        />
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
