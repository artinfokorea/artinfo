"use client"

import { IconButton } from "@/components/material"
import { XMarkIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import InquiryForm from "./inquiryForm"

const InquiryContainer = () => {
  return (
    <div
      className="mx-auto max-w-screen-lg px-4 lg:px-0"
      style={{
        height: "calc(100vh - 58px)",
      }}
    >
      <div className="h-full flex flex-col">
        <div className="relative mt-6">
          <Link href="/posts">
            <IconButton
              ripple={false}
              variant="text"
              size="md"
              className="absolute -top-1 text-black md:hidden"
            >
              <XMarkIcon className="w-6" />
            </IconButton>
          </Link>
          <h2 className="text-2xl font-bold text-center md:text-left">
            문의 작성하기
          </h2>
        </div>
        <InquiryForm />
      </div>
    </div>
  )
}

export default InquiryContainer
