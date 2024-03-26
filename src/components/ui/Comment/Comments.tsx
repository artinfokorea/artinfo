"use client"

import { Avatar } from "@/components/material"
import { ResizteTextArea } from "@/components/common/ResizteTextArea"
import { useState } from "react"
import { Comment } from "@/types/types"
import useFilters from "@/hooks/useFilters"
import useAuth from "@/hooks/useAuth"

export function CommentContainer({
  children,
  commentsCount = 0,
}: {
  children: React.ReactNode
  commentsCount?: number
}) {
  return (
    <>
      <h3 className="text-2xl font-semibold mb-4">댓글 {commentsCount}</h3>
      <div className="bg-white shadow-md overflow-hidden">{children}</div>
    </>
  )
}

interface ICommentFormProps {
  handleCreateComment: (comment: string) => void
  isLoading?: boolean
}
export function CommentForm({
  handleCreateComment,
  isLoading = false,
}: ICommentFormProps) {
  // const [acitveTextArea, setAcitveTextArea] = useState(false)
  const [comment, setComment] = useState("")

  return (
    <form className="p-4 border-b">
      <div className="">
        <ResizteTextArea
          value={comment}
          maxRows={10}
          maxLength={300}
          placeholder="내용을 입력해주세요(300자이하)"
          className="text-black text-base flex-1"
          onChange={value => setComment(value)}
        />
        <div className="flex justify-end">
          <button
            disabled={!comment || isLoading}
            className="bg-indigo-500 py-2 px-4 text-xs text-white rounded disabled:opacity-50"
            type="button"
            onClick={() => {
              setComment("")
              handleCreateComment(comment)
            }}
          >
            등록
          </button>
        </div>
      </div>
    </form>
  )
}

interface ICommentProps {
  comment: Comment
  handleDeleteComment: (commentId: number) => void
  secret?: boolean
}
export function CommentRow({
  comment,
  handleDeleteComment,
  secret,
}: ICommentProps) {
  const filters = useFilters()
  const auth = useAuth()

  const isCurrentUserComment = comment.profile_id === auth?.user?.id
  return (
    <div className="px-4 py-4">
      <div className="flex gap-x-2">
        {!secret && (
          <Avatar
            size="sm"
            variant="circular"
            src={
              comment.profiles?.icon_image_url || "/img/placeholder_user.png"
            }
            alt="user profile"
          />
        )}

        <div className="flex-1 ">
          <div
            className={
              secret ? "flex justify-between ml-1" : "flex justify-between"
            }
          >
            <div>
              <div className="text-sm leading-4">{comment.profiles?.name}</div>
              <div className="text-xs font-light">
                {filters.FROM_NOW_COMMENT(comment.created_at)}
              </div>
            </div>
            {isCurrentUserComment && (
              <button
                className="bg-indigo-500 py-2 px-4 text-xs text-white rounded disabled:opacity-50 hover:opacity-80"
                onClick={() => handleDeleteComment(comment.id)}
              >
                삭제
              </button>
            )}
          </div>
          <div className="p-2 bg-gray-100 rounded font-light text-sm mt-2 whitespace-pre-wrap">
            {comment.contents}
          </div>
        </div>
      </div>
    </div>
  )
}
