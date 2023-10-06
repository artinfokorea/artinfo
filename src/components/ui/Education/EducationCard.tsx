import React from "react"
import Image from "next/image"

const EducationCard = () => {
  return (
    <div className="card bg-white rounded-none md:rounded-md flex h-[80px]  text-primary  border-b border-lightgrey">
      <div className="relative h-full">
        <img
          src="/img/placeholder_user.png"
          alt="EduLogo"
          style={{ objectFit: "contain" }}
          className="h-full"
          //   sizes="(max-width: 200px) 76px, 30px"
          // sizes="(max-width: 1200px) 160px, 50px"
        />
      </div>
      <div className="ml-4">
        <div className="flex-1 flex justify-center flex-col">
          <span className="font-semibold text-lg mt-1 ">
            서울 피아노레슨 합니다.
          </span>
          <span className="text-sm opacity-70">몇일전</span>
        </div>
        <div className="flex">
          <span>카테고리</span>
        </div>
      </div>
    </div>
  )
}

export default EducationCard
