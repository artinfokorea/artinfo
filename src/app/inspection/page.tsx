import React from "react"

const page = () => {
  return (
    <div className="h-screen w-full">
      <div className="w-1/2 mx-auto break-keep flex flex-col mt-20">
        <h2 className="font-bold text-lg">현재 서비스 점검 중 입니다.</h2>
        <span className="mt-5">
          불편을 끼쳐드려 죄송합니다.
          <br />
          시스템 안정화를 위해 잠시 서버 점검 중입니다.
          <br />
          빠른 시간 내에 정상적인 서비스가 가능하도록 최선을 다하겠습니다.
          <br />
          감사합니다.
        </span>
      </div>
    </div>
  )
}

export default page
