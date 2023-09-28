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
import { Toaster } from "react-hot-toast"
import useToast from "@/hooks/useToast"
// import PullToRefresh from "@/components/PullToRefresh"
import ListWithLatestJobs from "@/components/ui/LatestJobs/ListWithLatestJobs"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { PostCard } from "./PostCard"
import AdContainer from "../../../app/(site)/home/components/ad/AdContainer"
import FeedSkeleton from "../Skeleton/FeedSkeleton"

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
  const router = useRouter()
  // if (!user) {
  //   return null
  // }
  return (
    <Card className="overflow-hidden p-4 rounded-none md:rounded-md">
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
            <button
              className="block px-4 py-3"
              onClick={() => router.push("/create")}
            >
              나누고 싶은 생각...
            </button>
          )}
          {!user && <div className="px-4 py-3">로그인이 필요합니다.</div>}
        </div>
      </div>
    </Card>
  )
}

function AdSection() {
  return (
    <div className="overflow-hidden bg-white py-4 px-4 drop-shadow-md shawdow-md md:rounded-md">
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
  const [isMounted, setIsMounted] = useState(false)
  const { successToast, errorToast } = useToast()
  const containerEl = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 0.3,
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
    refetch,
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
    <div ref={containerEl} className="mx-auto max-w-screen-lg  lg:px-0">
      {/* <PullToRefresh ref={containerEl} refetch={refetch} /> */}
      <div className="flex ">
        <div className="flex-1 overflow-hidden">
          <div className="mb-2 " id="top">
            <WriteFeedCard />
          </div>

          <div className="feed-groups pb-5">
            <AdSection />
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

            {/* {isMounted && isMobile && (
              <div className="fixed bottom-32 right-3 flex flex-col">
                <ScrollUpButton handleScroll={handleScroll} />
                <button
                  className="text-darkgrey my-2 bg-whitesmoke rounded-full drop-shadow-md "
                  onClick={() => router.push("/create")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </button>
              </div>
            )} */}
          </div>
          <div ref={ref} className="h-4" />
          <Toaster />
        </div>
        <div className="ml-5 hidden md:block " style={{ width: 300 }}>
          <ListWithLatestJobs />
        </div>
      </div>
    </div>
  )
}
