"use client"

import useSupabase from "@/hooks/useSupabase"
import { MAJOR_CATEGORY_ITEMS } from "@/types/types"
import { useRouter } from "next/navigation"

interface IProps {
  user: any
  // user: {
  //   id: string
  //   email: string
  //   name: string
  //   icon_image_url?: string | null
  //   article_cnt?: number
  //   comment_cnt?: number
  // }
}

export default function ProfileCard({ user }: IProps) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center">
        <img
          className="inline-block h-24 w-24 rounded-full"
          src={user.icon_image_url || "/img/placeholder_user.png"}
          alt="profile"
        />
        <div className="text-xl mt-2 font-semibold">{user.name}</div>
        <div className="text-lg">{user.email}</div>

        <div className="grid grid-cols-3 mt-8">
          <div>
            <div className="text-gray-500 text-lg">글작성</div>
            <div>{user.article_cnt}개</div>
          </div>
          <div>
            <div className="text-gray-500 text-lg">댓글</div>
            <div>{user.comment_cnt}개</div>
          </div>
          <div>
            <div className="text-gray-500 text-lg">좋아요</div>
            <div className="text-gray-500">곧지원예정</div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="border border-gray-400 p-6 mb-4">
          <div className="text-xl font-semi-bold">소개</div>
          <div>{user.intro}</div>
        </div>
        <div className="border border-gray-400 p-6 mb-4">
          <div className="text-xl font-semi-bold">전공</div>
          <div>{(MAJOR_CATEGORY_ITEMS as any)[user.major]}</div>
        </div>
        <div className="border border-gray-400 p-6 mb-4">
          <div className="text-xl font-semi-bold">학교</div>
          <div>{user.school}</div>
          {!user.school && (
            <div>
              아직 학교정보를 입력하지 않으셨네요.
              <br />
              내용을 입력해주세요.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
