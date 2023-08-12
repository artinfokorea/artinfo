"use client"

import React from "react"

interface Props {
  handleOpen: () => void
  modalIgnoreForAWeek: () => void
}

const HomeScreenModal = ({ handleOpen, modalIgnoreForAWeek }: Props) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-1">
      <div className="fixed top-0 left-0 w-full h-full backdrop-blur-sm z-2" />
      <div className="absolute rounded-xl bottom-16 z-3 bg-white shadow-md w-full">
        <div className="py-3 px-8 flex justify-between">
          <span>홈 화면에 추가</span>
          <button className="text-[#00a3d2]" onClick={handleOpen}>
            닫기
          </button>
        </div>
        <div className="border-b border-gray-300 mb-2" />
        <div className="py-5 w-4/5 mx-auto text-center text-md text-[#939393] break-all leading-5">
          이 웹사이트에는 앱 기능이 있습니다. 홈 화면에 추가하여 풀스크린 및
          오프라인으로 사용할 수 있습니다.
        </div>
        <div className="border-b border-gray-300 mb-2" />
        <div className="py-5  text-[#a0a0a0] w-4/5 mx-auto ">
          <div className="flex items-center juestify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#00a3d2"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
              />
            </svg>
            <span className="break-all leading-5 flex-1 ml-8">
              1) (사각에서 화살표가 튀어나온 마크)를 탭합니다.
            </span>
          </div>
          <div className="flex items-center mt-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-10 h-10 mr-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>

            <span className="break-all leading-5 flex-1">
              2) 홈 화면에 추가 를 탭합니다.
            </span>
          </div>
        </div>

        <div className="py-3 px-10 text-[#939393] flex items-center">
          <button onClick={modalIgnoreForAWeek}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <span className="ml-10">이 창을 일주일동안 보지 않기</span>
        </div>
      </div>
    </div>
  )
}

export default HomeScreenModal
