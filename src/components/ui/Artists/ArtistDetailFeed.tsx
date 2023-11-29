import { fetchFeeds } from "@/app/Api"
import { Feed } from "@/types/types"
import { useParams } from "next/navigation"
import { useInfiniteQuery } from "@tanstack/react-query"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import React from "react"
import { PostCard } from "../Post/PostCard"

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

  const handleUpdatePostLike = () => {}
  const handleDeleteFeed = () => {}

  return (
    <div>
      <div className="mt-2">
        <WriteFeedCard artistId={Number(params.id)} />
      </div>

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
    </div>
  )
}

export default ArtistDetailFeed
