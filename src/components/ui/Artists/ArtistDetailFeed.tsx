import { FEED } from "@/types/types"
import { useParams } from "next/navigation"
import {
  useQueryClient,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query"
import WriteFeedCard from "@/components/common/WriteFeedCard"
import { getFeedList } from "@/apis/feed"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import useAuth from "@/hooks/useAuth"
import useToast from "@/hooks/useToast"
import { deleteFeed, updatePostLike } from "@/app/Api"
import FeedSkeleton from "../Skeleton/FeedSkeleton"
import { ArtistFeedCard } from "./ArtistFeedCard"

const ArtistDetailFeed = () => {
  const params = useParams()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { successToast, errorToast } = useToast()

  const getFeeds = async (pageParam: number): Promise<any> => {
    const response = await getFeedList({
      page: pageParam,
      artistId: Number(params.id),
      requestUserId: user?.id,
    })
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
    queryKey: [`artist_feeds_${params.id}`],
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

  const updateFeedLikeMutation = useMutation({
    mutationFn: (payload: {
      like: boolean
      user_id: string
      post_id: number
    }) => {
      return updatePostLike(payload)
    },
    onMutate: updateLike => {
      queryClient.setQueryData([`artist_feeds_${params.id}`], (old: any) => {
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

  const handleUpdatePostLike = (payload: {
    like: boolean
    post_id: number
  }) => {
    console.log("11")
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
      queryClient.invalidateQueries([`artist_feeds_${params.id}`])
      successToast("게시글이 삭제되었습니다.")
    },
  })

  const handleDeleteFeed = (feedId: number) => {
    deleteFeedMutation.mutate(feedId)
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
