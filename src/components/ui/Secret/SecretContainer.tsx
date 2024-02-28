"use client"

import { getFeeds } from "@/apis/feed"
import { deleteFeed, updatePostLike } from "@/app/Api"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import useAuth from "@/hooks/useAuth"
import useToast from "@/hooks/useToast"
import { FEED } from "@/types/types"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { useDidUpdate } from "@toss/react"
import { usePathname } from "next/navigation"
import React, { useRef } from "react"
import { useInView } from "react-intersection-observer"
import { SecretCard } from "./SecretCard"

const SecretContainer = () => {
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const containerEl = useRef<HTMLDivElement>(null)
  const { successToast, errorToast } = useToast()
  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.3,
  })

  const {
    data: feedsData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feeds", pathname],
    queryFn: ({ pageParam = 1 }) => {
      return getFeeds({
        page: pageParam,
        requestUserId: user?.id,
        category: pathname === "/choir" ? "CHOIR" : "ORCHESTRA",
      })
    },
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
  })

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const updateFeedLikeMutation = useMutation({
    mutationFn: (payload: {
      like: boolean
      user_id: string
      post_id: number
    }) => {
      return updatePostLike(payload)
    },
    onMutate: updateLike => {
      queryClient.setQueryData(["feeds", pathname], (old: any) => {
        const pages = [...old.pages]

        pages.forEach(page => {
          page.feeds.forEach((feed: FEED) => {
            if (feed.feedId === updateLike.post_id) {
              // eslint-disable-next-line no-param-reassign
              feed.isLiking = updateLike.like
              if (updateLike.like) {
                // eslint-disable-next-line no-param-reassign
                feed.countOfLikes += 1
              } else {
                // eslint-disable-next-line no-param-reassign
                feed.countOfLikes -= 1
              }
            }
          })
        })
        return {
          pages,
          pageParams: [...old.pageParams],
        }
      })
    },
  })

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => {
      return deleteFeed(feedId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feeds", pathname])
      successToast("게시글이 삭제되었습니다.")
    },
  })

  const handleUpdatePostLike = (payload: {
    like: boolean
    post_id: number
  }) => {
    updateFeedLikeMutation.mutate({ ...payload, user_id: user!.id })
  }

  const handleDeleteFeed = (feedId: number) => {
    deleteFeedMutation.mutate(feedId)
  }

  return (
    <div className="mx-auto max-w-screen-md lg:px-0 pt-0 md:pt-2">
      <div>
        <WriteFeedCard secret={pathname === "/choir" ? "choir" : "orchestra"} />
      </div>
      <div>
        {feedsData?.pages.map(group => (
          <div key={group.nextPage}>
            {group.feeds.map((feed: FEED, index: number) => (
              <div key={feed.feedId} className="my-2">
                <SecretCard
                  feed={feed}
                  handleUpdatePostLike={handleUpdatePostLike}
                  handleDeleteFeed={handleDeleteFeed}
                  showCommentBtn
                  shortContent
                />
                {hasNextPage && index === group.feeds.length - 5 && (
                  <div ref={ref} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SecretContainer
