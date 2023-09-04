"use client"

import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
  Tooltip,
  Button,
} from "@/components/material"

import { useAuth } from "@/app/(auth)/auth/components/AuthProvider"
import Link from "next/link"
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query"
import { deleteFeed, fetchFeeds, updatePostLike } from "@/app/Api"
import { useInView } from "react-intersection-observer"
import { useDidUpdate } from "@toss/react"
import { isMobileWeb } from "@toss/utils"
import ScrollUpButton from "@/components/ui/Button/ScrollUpButton"
import { Feed } from "@/types/types"
import { PostCard } from "./PostCard"
import AdContainer from "../../../home/components/ad/AdContainer"
import FeedSkeleton from "./FeedSkeleton"

function ProfileCard() {
  return (
    <Card className="w-96">
      <CardHeader floated={false} className="h-80">
        <img
          src="https://www.material-tailwind.com/img/team-3.jpg"
          alt="profile-picture"
        />
      </CardHeader>
      <CardBody className="text-center">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Natalie Paisley
        </Typography>
        <Typography color="blue" className="font-medium" textGradient>
          CEO / Co-Founder
        </Typography>
      </CardBody>
      <CardFooter className="flex justify-center gap-7 pt-2">
        <Tooltip content="Like">
          <Typography
            as="a"
            href="#facebook"
            variant="lead"
            color="blue"
            textGradient
          >
            <i className="fab fa-facebook" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#twitter"
            variant="lead"
            color="light-blue"
            textGradient
          >
            <i className="fab fa-twitter" />
          </Typography>
        </Tooltip>
        <Tooltip content="Follow">
          <Typography
            as="a"
            href="#instagram"
            variant="lead"
            color="purple"
            textGradient
          >
            <i className="fab fa-instagram" />
          </Typography>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

function WriteFeedCard() {
  const { user } = useAuth()
  // if (!user) {
  //   return null
  // }
  return (
    <Card className="overflow-hidden p-4">
      <div className="flex items-center gap-x-4">
        {user && (
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-blue-500 p-0.5"
            src={
              user?.user_metadata.icon_image_url || "/img/placeholder_user.png"
            }
          />
        )}

        <div className="bg-gray-100 rounded-lg flex-1">
          {user && (
            <Link href="/posts/create" className="block px-4 py-3">
              나누고 싶은 생각...
            </Link>
          )}
          {!user && <div className="px-4 py-3">로그인이 필요합니다.</div>}
        </div>
      </div>
    </Card>
  )
}

function AdSection() {
  return (
    <div className="overflow-hidden bg-white py-4 px-4 mt-4 drop-shadow-md shawdow-md rounded-lg">
      <h5 className="font-semibold mb-2">콘서트</h5>
      <div className="overflow-x-auto">
        <AdContainer />
      </div>
    </div>
  )
}

export default function Container() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.5,
  })

  const isMobile = isMobileWeb()

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
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["feeds"],
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

  useDidUpdate(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage])

  const handleScroll = () => {
    const element = document.getElementById("top")

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
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
      queryClient.setQueryData(["feeds"], (old: any) => {
        const pages = [...old.pages]
        pages.forEach(page => {
          page.feeds.forEach((feed: any) => {
            if (feed.id === updateLike.post_id) {
              // eslint-disable-next-line no-param-reassign
              feed.like = updateLike.like
              if (updateLike.like) {
                // eslint-disable-next-line no-param-reassign
                feed.count_of_likes += 1
              } else {
                // eslint-disable-next-line no-param-reassign
                feed.count_of_likes -= 1
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
    onMutate: feedId => {
      queryClient.setQueryData(["feeds"], (data: any) => {
        // eslint-disable-next-line no-param-reassign
        data.pages = data.pages.map((page: any) => {
          // eslint-disable-next-line no-param-reassign
          page.feeds = page.feeds.filter((feed: any) => feed.id !== feedId)
          return page
        })
        return data
      })
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
    <>
      <div className="mb-5" id="top">
        <WriteFeedCard />
      </div>

      <div className="feed-groups pb-10">
        {/* <div className="mt-5">
          <ProfileCard />
        </div> */}
        {isLoading && (
          <>
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
            <FeedSkeleton />
          </>
        )}
        <AdSection />

        {feedsData?.pages.map(group => (
          <div key={group.page}>
            {/* <div>page: {group.page}</div> */}

            {/* {group.page === 2 && } */}

            {group.feeds.map((feed: Feed) => (
              <div key={feed.id} className="my-4">
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
        <div ref={ref} />
        {isMobile && (
          <div className="fixed bottom-1/4 right-3">
            <ScrollUpButton handleScroll={handleScroll} />
          </div>
        )}
      </div>
    </>
  )
}
