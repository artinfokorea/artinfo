"use client"

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { CommentType, Feed } from "@/types/types"
import { useAuth } from "@/app/(auth)/auth/components/AuthProvider"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { isMobileWeb } from "@toss/utils"
import {
  createComment,
  deleteComment,
  fetchComments,
  fetchFeed,
  updatePostLike,
} from "@/app/Api"
import { PostCard } from "../components/PostCard"
import { CommentContainer, CommentForm, CommentRow } from "./Comments"
import CommentCardSkeleton from "./CommentCardSkeleton"

const ListButton = dynamic(() => import("@/components/ui/Button/ListButton"), {
  ssr: false,
  loading: () => <div>loading...</div>,
})

interface IProps {
  pageId: string
}

export default function Container({ pageId }: IProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const isMobile = isMobileWeb()

  const { data: feed } = useQuery({
    queryKey: ["feed", pageId],
    suspense: true,
    queryFn: () => fetchFeed(Number(pageId)),
  })

  // console.log(feed)
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
    }) => {
      return createComment(comment)
    },
    onMutate: commentData => {
      const optimisticComment = {
        ...commentData,
        id: 0,
        profiles: {
          id: user!.id,
          name: user!.user_metadata.name,
          icon_image_url: user!.user_metadata.icon_image_url,
        },
        created_at: new Date(),
      }
      queryClient.setQueryData(["comments", pageId], (old: any) => {
        // console.log(old)
        const firstPage = old.pages[0]
        const firstPageComments = firstPage.comments
        const newFirstPageComments = [optimisticComment, ...firstPageComments]
        // eslint-disable-next-line no-param-reassign
        old.pages[0].comments = newFirstPageComments
        return {
          pages: [...old.pages],
          pageParams: [...old.pageParams],
        }
      })

      return { optimisticComment }
    },
    onSuccess: (newCommentId, variables) => {
      queryClient.setQueryData(["comments", pageId], (old: any) => {
        const firstPage = old.pages[0]
        const firstPageComments = firstPage.comments
        firstPageComments[0].id = newCommentId
        // eslint-disable-next-line no-param-reassign
        old.pages[0].comments = firstPageComments

        return {
          pages: [...old.pages],
          pageParams: [...old.pageParams],
        }
      })
    },
  })

  const handleCreateComment = (comment: string) => {
    createCommentMutation.mutate({
      postId,
      contents: comment,
      type: "POST",
      profile_id: user!.id,
    } as any)
  }

  const deleteCommentMutation = useMutation({
    mutationFn: (comment: { id: number }) => {
      return deleteComment(comment.id)
    },
    // onMutate: commentId => {
    //   // 삭제되기 전에 데이터를 삭제 전 상태로 업데이트 (옵티미스틱 업데이트)
    //   queryClient.setQueryData(["comments", pageId], (old: any) => {
    //     // old 데이터에서 commentId와 일치하는 댓글을 찾아 삭제
    //     const firstPage = old.pages[0]
    //     const firstPageComments = firstPage.comments.filter(
    //       (comment: any) => comment.id !== commentId,
    //     )
    //     old.pages[0].comments = firstPageComments
    //     return {
    //       pages: [...old.pages],
    //       pageParams: [...old.pageParams],
    //     }
    //   })

    //   return { commentId } // 삭제된 commentId를 반환
    // },
    onSuccess: (newCommentId, variables) => {
      // queryClient.setQueryData(["comments", pageId], (old: any) => {
      //   const firstPage = old.pages[0]
      //   const firstPageComments = firstPage.comments
      //   firstPageComments[0].id = newCommentId
      //   // eslint-disable-next-line no-param-reassign
      //   old.pages[0].comments = firstPageComments

      //   return {
      //     pages: [...old.pages],
      //     pageParams: [...old.pageParams],
      //   }
      // })
      refetch()
    },
  })

  const handleDeleteComment = (commentId: number) => {
    console.log(postId)
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
        return {
          ...old,
          like: updateLike.like,
        }
      })
    },
  })

  const handleUpdatePostLike = (payload: {
    like: boolean
    post_id: number
  }) => {
    updateFeedLikeMutation.mutate({ ...payload, user_id: user!.id })
  }

  return (
    <div className="pb-8 relative">
      <PostCard
        feed={feed as any}
        handleUpdatePostLike={handleUpdatePostLike}
      />
      <div className="mt-14">
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
        <div className="fixed bottom-1/4 right-3">
          <ListButton />
        </div>
      )}
    </div>
  )
}
