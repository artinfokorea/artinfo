"use client"

import { getFeeds } from "@/apis/feed"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import useAuth from "@/hooks/useAuth"
import { FEED } from "@/types/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useDidUpdate } from "@toss/react"
import { usePathname } from "next/navigation"
import React, { useRef } from "react"
import { useInView } from "react-intersection-observer"
import { useFeedMutation } from "@/hooks/useFeedMutation"
import { SecretCard } from "./SecretCard"

const SecretContainer = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const { updateFeedLike, deleteFeedMutate } = useFeedMutation({
    type: "secret",
  })
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

  const handleUpdatePostLike = (payload: {
    like: boolean
    post_id: number
  }) => {
    updateFeedLike({ ...payload, user_id: user!.id })
  }

  const handleDeleteFeed = (feedId: number) => {
    deleteFeedMutate(feedId)
  }

  return (
    <div className="mx-auto max-w-screen-md lg:px-0 pt-0 md:pt-2 pb-10">
      <div className="text-xl font-semibold p-4">
        <h2>
          {pathname === "/orchestra" ? "국·시립교향악단" : "국·시립합창단"}
        </h2>
      </div>
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
