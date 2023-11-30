import { fetchFeeds } from "@/app/Api"
import { Feed } from "@/types/types"
import { useParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import React, { useRef, useEffect } from "react"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import { PostCard } from "../Post/PostCard"
import FeedSkeleton from "../Skeleton/FeedSkeleton"

const ArtistDetailFeed = () => {
  const params = useParams()

  const getFeeds = async (pageParam: number): Promise<any> => {
    const response = await fetchFeeds({ pageParam })
    return {
      feeds: response,
      nextPage: pageParam + 1,
      isLast: response.length < 10,
    }
  }

  const {
    data: feedsData,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["artist_feeds"],
    suspense: false,
    queryFn: ({ pageParam = 1 }) => {
      return getFeeds(pageParam)
    },
    getNextPageParam: lastPage => {
      if (!lastPage.isLast) return lastPage.nextPage
      return null
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  })

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.3,
  })

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const handleUpdatePostLike = () => {}
  const handleDeleteFeed = () => {}

  return (
    <div>
      <div>
        <WriteFeedCard artistId={Number(params.id)} />
      </div>
      {isLoading && (
        <>
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </>
      )}

      {feedsData?.pages.map(group => (
        <div key={group.nextPage}>
          {group.feeds.map((feed: Feed) => (
            <div key={feed.id} className="my-2">
              <PostCard
                feed={feed as any}
                handleUpdatePostLike={handleUpdatePostLike}
                handleDeleteFeed={handleDeleteFeed}
                showCommentBtn
                shortContent
              />
            </div>
          ))}
        </div>
      ))}
      <div ref={ref} className="h-4" />
    </div>
  )
}

export default ArtistDetailFeed
