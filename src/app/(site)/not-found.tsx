"use client"

import { Button } from "@/components/material"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="w-full h-full flex justify-center flex-col items-center">
      <h2 className="my-[40px] text-2xl">페이지를 찾을수 없습니다.</h2>
      <div>
        <Button
          size="lg"
          color="red"
          variant="text"
          className="rounded-md md:inline-block text-lg"
          onClick={() => router.push("/posts")}
        >
          메인 페이지로 돌아가기
        </Button>
      </div>
    </div>
  )
}
