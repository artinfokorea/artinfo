"use client"

import { useAuth } from "@/components/ui/Auth/AuthProvider"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { deleteFeed, updatePostLike } from "@/app/Api"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import { FEED } from "@/types/types"
import useToast from "@/hooks/useToast"
import { getFeeds } from "@/apis/feed"
import ListWithLatestJobs from "@/components/ui/LatestJobs/ListWithLatestJobs"
import { useRouter } from "next/navigation"
import LockIcon from "@/components/icons/Lock"
import { useRef, useState } from "react"
import { PostCard } from "./PostCard"
import AdContainer from "../Home/ad/AdContainer"
import BannerContainer from "../Banner/BannerContainer"

function AdSection() {
  return (
    <div className="overflow-hidden bg-white py-4 px-4 drop-shadow-md shawdow-md md:rounded-md">
      <h5 className="font-semibold mb-2 text-lg">콘서트</h5>
      <div className="overflow-x-auto">
        <AdContainer />
      </div>
    </div>
  )
}

export default function Container() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [secretTab, setSecretTab] = useState(false)
  const { successToast, errorToast } = useToast()
  const containerEl = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.3,
  })

  const {
    data: feedsData,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["feeds", user?.id],
    suspense: true,
    queryFn: ({ pageParam = 1 }) => {
      return getFeeds({
        page: pageParam,
        requestUserId: user?.id,
        category: "ARTIST",
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
      queryClient.setQueryData(["feeds", user?.id], (old: any) => {
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
      queryClient.invalidateQueries(["feeds"])
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
    <div
      ref={containerEl}
      className="mx-auto max-w-screen-lg lg:px-0 pt-0 md:pt-2"
    >
      <BannerContainer />
      <div className="flex my-2">
        <div className="flex-1 overflow-hidden" id="top">
          <div className="feed-groups pb-5">
            {!secretTab ? (
              <div className="flex justify-center px-4 md:px-0 mb-2 bg-[#F1F4FF]">
                <button
                  className="flex w-full py-2 justify-center items-center rounded-md border border-grey hover:shadow-md"
                  onClick={() => setSecretTab(!secretTab)}
                >
                  <LockIcon className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="text-skyblue text-sm md:text-lg ml-2">
                    연주자 익명게시판
                  </span>
                </button>
              </div>
            ) : (
              <div className="text-white grid grid-cols-2 gap-x-4 px-2 mb-2 font-semibold text-sm md:text-lg">
                <button
                  className="bg-primaryblue h-[46px] w-full rounded-3xl"
                  onClick={() => router.push("/choir")}
                >
                  국·시립합창단
                </button>
                <button
                  className="bg-primaryred h-[46px] w-full rounded-3xl"
                  onClick={() => router.push("/orchestra")}
                >
                  국·시립교향악단
                </button>
              </div>
            )}

            <AdSection />

            {feedsData?.pages.map(group => (
              <div key={group.nextPage}>
                {group.feeds.map((feed: FEED, index: number) => (
                  <div key={feed.feedId} className="my-2">
                    <PostCard
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
        <div className="ml-5 hidden md:block" style={{ width: 300 }}>
          <ListWithLatestJobs />
        </div>
      </div>
    </div>
  )
}
