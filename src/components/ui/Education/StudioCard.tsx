import React from "react"
import Image from "next/image"

const StudioCard = () => {
  return (
    <div className="card rounded-none cursor-pointer md:rounded-md">
      <div className="overflow-hidden relative h-[200px]">
        <Image
          src="/studio.jpg"
          alt="job"
          sizes="(max-width: 1200px) 276px, 150px"
          fill
          priority
          quality={100}
        />
      </div>

      <div className="px-2">
        <div className="flex-1 flex justify-center flex-col font-sm">
          <span className="font-semibold text-lg mt-1 ">필피아노 스튜디오</span>
          <span>지역</span>
          <span>주차가능 가까운 지하철역 연습실갯수</span>
          슬라이드로 가야되나?
        </div>
      </div>
    </div>
  )
}

export default StudioCard
