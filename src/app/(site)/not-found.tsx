"use client"

import Link from "next/link"

export default function NotFound() {
  return (
    <div className="bg-white text-black">
      <h1>404에요</h1>
      <div>
        <Link href="/">메인 대시보드로 돌아가기</Link>
      </div>
    </div>
  )
}
