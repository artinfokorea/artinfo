"use client"

import { useAuth } from "@/components/ui/Auth/AuthProvider"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import { ADS, BANNER, FEED, JOB } from "@/types/types"
import { getFeeds } from "@/apis/feed"
import { useFeedMutation } from "@/hooks/useFeedMutation"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { PostCard } from "./PostCard"
import BannerContainer from "../Banner/BannerContainer"
import AdContainer from "../Home/ad/AdContainer"
import ListWithLatestJobs from "../LatestJobs/ListWithLatestJobs"

export default function Container() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [secretTab, setSecretTab] = useState(false)
  const containerEl = useRef<HTMLDivElement>(null)
  const { updateFeedLike, deleteFeedMutate } = useFeedMutation({ type: "post" })
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

  const adsResult = queryClient.getQueryData<{ data: ADS[] }>(["ads"])
  const bannerResult = queryClient.getQueryData<BANNER[]>(["banners"])
  const jobsResult = queryClient.getQueryData<JOB[]>(["jobs"])

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
    <div
      ref={containerEl}
      className="mx-auto max-w-screen-lg lg:px-0 pt-0 md:pt-2"
    >
      <BannerContainer banners={bannerResult} />
      <div className="flex my-2">
        <div className="flex-1 overflow-hidden" id="top">
          <div className="feed-groups pb-5">
            {/* {!secretTab ? (
              <div className="flex justify-center px-4 md:px-0 mb-2 ">
                <button
                  className="flex w-full h-[46px] py-2 justify-center items-center rounded-md border border-grey hover:shadow-md bg-[#F1F4FF]"
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
            )} */}

            <AdContainer ads={adsResult?.data} />
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
          <ListWithLatestJobs jobs={jobsResult} />
        </div>
      </div>
    </div>
  )
}
