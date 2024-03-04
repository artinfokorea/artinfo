import { FEED } from "@/types/types"
import { useParams } from "next/navigation"
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import { getFeeds } from "@/apis/feed"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import useAuth from "@/hooks/useAuth"
import { useFeedMutation } from "@/hooks/useFeedMutation"
import FeedSkeleton from "../Skeleton/FeedSkeleton"
import { ArtistFeedCard } from "./ArtistFeedCard"

const ArtistDetailFeed = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { updateFeedLike, deleteFeedMutate } = useFeedMutation({
    type: "artist",
  })

  const {
    data: feedsData,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["feeds", params.id],
    suspense: false,
    queryFn: ({ pageParam = 1 }) => {
      return getFeeds({
        page: pageParam,
        requestUserId: user?.id,
        artistId: Number(params.id),
        category: "ARTIST",
      })
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
          {group.feeds.map((feed: FEED) => (
            <div key={feed.feedId} className="my-2">
              <ArtistFeedCard
                feed={feed}
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
