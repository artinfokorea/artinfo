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
import Image from "next/image"
import { useRef } from "react"
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
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["feeds", user?.id],
    suspense: true,
    queryFn: ({ pageParam = 1 }) => {
      return getFeeds(pageParam, user?.id)
    },
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
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
          {/* <div className="mb-2 ">
            <WriteFeedCard />
          </div> */}
          <div className="feed-groups pb-5">
            {/* <LessonSlide /> */}
            {/* <Visitor /> */}
            {/* <div className="flex justify-center px-4 md:px-0 mb-2">
              <button className="w-full h-16 relative  ">
                <Image
                  src="/secret-post.png"
                  alt="secret_post_img"
                  fill
                  unoptimized
                  priority
                  className="hover:shadow-md"
                  sizes="(max-width: 768px) 300px, 76px"
                />
              </button>
            </div>
            <div className="grid grid-cols-2 px-4 md:px-0 mb-2 gap-2">
              <button className="w-full h-16 relative ">
                <Image
                  src="/chorus.png"
                  alt="chorus_post_img"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 300px, 76px"
                  className="rounded-xl hover:shadow-md"
                />
              </button>
              <button className="w-full h-16 relative ">
                <Image
                  src="/symphony.png"
                  alt="chorus_post_img"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 300px, 76px"
                  className="rounded-xl hover:shadow-md"
                />
              </button>
            </div> */}
            <AdSection />

            {/* {isLoading && (
              <>
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
                <FeedSkeleton />
              </>
            )} */}

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
