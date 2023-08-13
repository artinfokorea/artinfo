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
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import { deleteFeed, fetchFeeds, updatePostLike } from "@/app/Api"
import { PostCard } from "./PostCard"
import AdContainer from "../../../home/components/ad/AdContainer"

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
  // console.log(isLoading)
  // if (isLoading) {
  //   return <div />
  // }

  const itemCount = 10
  const {
    data: feedsData,
    hasNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["feeds"],
    suspense: false,
    queryFn: async ({ pageParam = 0 }) => {
      const feeds = await fetchFeeds({ pageParam: pageParam + 1 })
      return { feeds, page: pageParam + 1 }
    },
    getNextPageParam: (lastPage, pages) =>
      (lastPage.feeds?.length || 0) >= itemCount && lastPage.page,
  })

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
      <div className="mb-5">
        <WriteFeedCard />
      </div>

      <div className="feed-groups pb-10">
        {/* <div className="mt-5">
          <ProfileCard />
        </div> */}

        {feedsData?.pages.map(group => (
          <div key={group.page}>
            {/* <div>page: {group.page}</div> */}

            {group.page === 2 && <AdSection />}

            {group.feeds.map(feed => (
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

        {hasNextPage && (
          <button
            className="transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            disabled={isFetching}
            onClick={() => fetchNextPage()}
          >
            {isFetching ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx={12}
                  cy={12}
                  r={10}
                  stroke="currentColor"
                  strokeWidth={4}
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <span>더보기</span>
            )}
          </button>
        )}
      </div>
    </>
  )
}
