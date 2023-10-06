import React from "react"
import Image from "next/image"

const EducationCard = () => {
  return (
    <div className="card bg-white rounded-none md:rounded-md flex h-[100px]  text-primary  border-b border-lightgrey">
      <div className="relative h-[100px] w-[200px]">
        <Image
          src="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concert/1684796168324"
          alt="lesson-Profile"
          sizes="(max-width: 1200px) 220px, 100px"
          fill
          priority
          className="rounded-md"
        />
      </div>
      <div className="p-2">
        <div className="flex-1 flex justify-center flex-col">
          <span className="font-semibold text-lg">
            한예종 피아노과 4학년 재학중입니다.
          </span>
          <span className="text-sm opacity-70">몇일전</span>
        </div>

        <div className="mt-1">카테고리</div>
      </div>
    </div>
  )
}

export default EducationCard
