"use client"

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { CommentType } from "@/types/types"
import { useAuth } from "@/components/ui/Auth/AuthProvider"
import { notFound, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { isMobileWeb } from "@toss/utils"
import useToast from "@/hooks/useToast"
import { getFeed } from "@/apis/feed"
import {
  createComment,
  deleteComment,
  deleteFeed,
  fetchComments,
  updatePostLike,
} from "@/app/Api"
import { CommentContainer, CommentForm, CommentRow } from "../Comment/Comments"
import CommentCardSkeleton from "../Skeleton/CommentCardSkeleton"
import { SecretCard } from "./SecretCard"

const ListButton = dynamic(() => import("@/components/ui/Button/ListButton"), {
  ssr: false,
  loading: () => <div>loading...</div>,
})

interface IProps {
  pageId: string
}

export default function SecretDetailContainer({ pageId }: IProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isMobile = isMobileWeb()
  const { successToast, errorToast } = useToast()
  const router = useRouter()

  const { data: feed } = useQuery({
    queryKey: ["feed", pageId],
    queryFn: () => getFeed(Number(pageId), user?.id),
  })

  if (!feed) {
    notFound()
  }

  const postId = Number(pageId)
  const itemCount = 10
  const {
    data: commentsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
    refetch,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["comments", pageId],
    suspense: false,
    queryFn: async ({ pageParam = 0 }) => {
      const { comments, count } = await fetchComments({
        postId,
        pageParam,
        itemCount,
      })
      return { comments, count, page: pageParam + 1 }
    },
    getNextPageParam: (lastPage, pages) =>
      (lastPage.comments?.length || 0) >= itemCount && lastPage.page,
  })

  const createCommentMutation = useMutation({
    mutationFn: (comment: {
      postId: number
      contents: string
      type: CommentType
      profile_id: string
      created_at: string
    }) => {
      return createComment(comment)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: (newCommentId, variables) => {
      queryClient.invalidateQueries(["comments"])
      successToast("댓글이 등록되었습니다.")
    },
  })

  const handleCreateComment = (comment: string) => {
    createCommentMutation.mutate({
      postId,
      contents: comment,
      type: "POST",
      profile_id: user!.id,
      created_at: new Date().toISOString(),
    } as any)
  }

  const deleteCommentMutation = useMutation({
    mutationFn: (comment: { id: number }) => {
      return deleteComment(comment.id)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      refetch()
      successToast("댓글이 삭제되었습니다.")
    },
  })

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({
      id: commentId,
    })
  }

  const updateFeedLikeMutation = useMutation({
    mutationFn: (payload: {
      like: boolean
      user_id: string
      post_id: number
    }) => {
      return updatePostLike(payload)
    },
    onMutate: updateLike => {
      queryClient.setQueryData(["feed", pageId], (old: any) => {
        const feed = old
        feed.isLiking = updateLike.like
        if (updateLike.like) {
          feed.countOfLikes += 1
        } else {
          feed.countOfLikes -= 1
        }
        return {
          ...feed,
          like: updateLike.like,
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })

  const handleUpdatePostLike = (payload: {
    like: boolean
    post_id: number
  }) => {
    updateFeedLikeMutation.mutate({ ...payload, user_id: user!.id })
  }

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => {
      return deleteFeed(feedId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      successToast("댓글이 삭제되었습니다.")
    },
  })

  const handleDeleteFeed = (feedId: number) => {
    deleteFeedMutation.mutate(feedId)
    router.back()
  }

  return (
    <div className="pb-8 relative">
      <SecretCard
        feed={feed as any}
        handleUpdatePostLike={handleUpdatePostLike}
        handleDeleteFeed={handleDeleteFeed}
      />
      <div className="mt-14 mx-2">
        <CommentContainer commentsCount={commentsData?.pages[0].count || 0}>
          {user && (
            <CommentForm
              handleCreateComment={handleCreateComment}
              isLoading={createCommentMutation.isLoading}
            />
          )}

          {isLoading && (
            <div>
              <CommentCardSkeleton />
            </div>
          )}
          {commentsData?.pages.map(group => {
            return group.comments.map(comment => (
              <CommentRow
                key={comment.id}
                comment={comment}
                handleDeleteComment={handleDeleteComment}
              />
            ))
          })}
        </CommentContainer>

        {hasNextPage && (
          <button
            className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            disabled={isFetching}
            onClick={() => fetchNextPage()}
          >
            {isFetching ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={4}
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span>더보기</span>
            )}
          </button>
        )}
      </div>
      {isMobile && (
        <div className="fixed bottom-32 right-3">
          <ListButton list="artists" />
        </div>
      )}
    </div>
  )
}
