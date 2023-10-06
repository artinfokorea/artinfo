import Image from "next/image"
import React from "react"

const TestCard = ({ index }: { index: number }) => {
  return (
    <div className="card bg-white rounded-md">
      {index % 2 === 0 && (
        <div className="overflow-hidden relative h-[100px]">
          <Image
            src="/icon-192x192.png"
            alt="job"
            sizes="(max-width: 1200px) 276px, 150px"
            fill
            priority
            className="rounded-md"
          />
        </div>
      )}

      {index % 2 === 0 ? (
        <div className="px-2">
          <div className="flex-1 flex justify-center flex-col">
            <span className="font-semibold text-lg mt-1 ">
              한예종 피아노과 4학년 재학중입니다.
            </span>
            <span className="text-sm opacity-70 my-2">몇일전</span>
          </div>
          <div className="flex">
            <span>카테고리</span>
          </div>
        </div>
      ) : (
        <div className="p-2">
          <div className="flex-1 flex justify-center flex-col">
            <span className="font-semibold text-lg mt-1 break-keep">
              보컬 방문레슨 가능 경북예고출신 공중파 방송출연
            </span>
            <span className="text-sm opacity-70 my-2">몇일전</span>
          </div>
          <div className="flex">
            <span>카테고리</span>
          </div>
          <div>이미지가 없을 경우엔 여기에 프로필 정보를 조금?</div>
        </div>
      )}
    </div>
  )
}

export default TestCard
