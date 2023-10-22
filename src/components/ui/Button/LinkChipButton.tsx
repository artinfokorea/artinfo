"use client"

import { useRouter } from "next/navigation"
import React from "react"

interface IProps {
  url: string
  title: string
}

export const ChipButton = ({ url, title }: IProps) => {
  const router = useRouter()

  const goToTarget = (url: string) => {
    console.log("url", url)
    router.push(url)
  }

  return (
    <button
      className="flex items-center rounded-2xl w-15 h-8 py-2 px-3 mb-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400"
      onClick={() => goToTarget(url)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="w-5 h-5 mr-1"
      >
        <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
      </svg>

      <span className="whitespace-nowrap text-md">{title}</span>
    </button>
  )
}
