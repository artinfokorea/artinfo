"use client"

import Image from "next/image"
import {
  ShareIcon,
  BookmarkIcon,
  ChatBubbleLeftEllipsisIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"

import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/components/material"
import { FEED_CATEGORIES, Feed } from "@/types/types"
import useFilters from "@/hooks/useFilters"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { clipboard } from "@toss/utils"
import toast, { Toaster } from "react-hot-toast"
import { useAuth } from "@/app/(auth)/auth/components/AuthProvider"
import PositionTag from "@/components/ui/PositionTag"
import useLocalforge from "@/hooks/useLocalforage"
import { fetchSiteMetaData } from "@/app/Api"
import { Modal } from "@/components/ui/Modal"
import ReactHtmlParser from "react-html-parser"
import PostSitePreview from "./PostSitePreview"
// import useSnackbar from "@/hooks/useSnackbar"

const useTruncatedElement = ({ ref }: any) => {
  const [isTruncated, setIsTruncated] = useState(false)
  const [isReadingMore, setIsReadingMore] = useState(false)

  useLayoutEffect(() => {
    const { offsetHeight, scrollHeight } = ref.current || {}

    if (offsetHeight && scrollHeight && offsetHeight < scrollHeight) {
      setIsTruncated(true)
    } else {
      setIsTruncated(false)
    }
  }, [ref])

  return {
    isTruncated,
    isReadingMore,
    setIsReadingMore,
  }
}

type SitePreviewMetaType = {
  fullUrl: string
  url: string
  host: string
  title: string
  description?: string
  image?: string
}

interface IProps {
  feed: Feed
  showCommentBtn?: boolean
  shortContent?: boolean
  handleUpdatePostLike?: (payload: { like: boolean; post_id: number }) => void
  handleDeleteFeed?: (id: number) => void
}

export function PostCard({
  feed,
  showCommentBtn = false,
  shortContent = false,
  handleUpdatePostLike,
  handleDeleteFeed,
}: IProps) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const [sitePreviewData, setSitePreviewData] = useState<SitePreviewMetaType>()
  const params = useParams()
  const ref = useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
  })

  const notify = (text: string) =>
    toast.success(text, {
      duration: 4000,
      position: "bottom-center",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#449F3C",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    })

  const notifyError = (text: string) =>
    toast.error(text, {
      duration: 4000,
      position: "bottom-center",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#EA2A2A",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    })

  const filters = useFilters()
  const image = feed.image_urls?.length ? feed.image_urls[0] : null

  const { getLocalData, setLocalData } = useLocalforge()

  const fetchSiteData = async (url: string) => {
    const sitePreviewKey = `preview-url:${url}`
    const sitePreviewDataFromDB =
      await getLocalData<SitePreviewMetaType>(sitePreviewKey)
    if (sitePreviewDataFromDB) {
      setSitePreviewData(sitePreviewDataFromDB)
      return
    }

    try {
      const data = await fetchSiteMetaData(url)
      setSitePreviewData(data)
      setLocalData(sitePreviewKey, data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const siteUrl = filters.EXTRACT_URL(feed.content)
    if (siteUrl) {
      fetchSiteData(siteUrl)
    }
  }, [feed.content])

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}/posts/${feed.id}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      notify("공유할 포스트 URL을 클립보드에 복사했어요!")
    }
  }

  const handleToggleLike = () => {
    if (!user) {
      notifyError("로그인이 필요합니다.")

      return
    }

    if (handleUpdatePostLike) {
      handleUpdatePostLike({
        like: !feed.like,
        post_id: feed.id,
      })
    }
  }

  const handleMoveToUserProfile = () => {
    router.push(`/profile/${feed.profile_id}`)
  }

  const handleBookmark = () => {
    // openSnackbar("아직 지원하지 않는 기능입니다.", 2000)
  }

  const handleDeleteFeedItem = () => {
    setIsOpenModal(false)
    if (handleDeleteFeed) {
      handleDeleteFeed(feed.id)
    }
  }

  // console.log("feed", feed)

  return (
    <>
      <Card
        className={`transition-transform transform cursor-pointer ${
          !params.id && "hover:scale-95"
        }`}
        onClick={() => router.push(`/posts/${feed.id}`)}
      >
        <CardHeader
          shadow={false}
          floated={false}
          className="flex items-center gap-2"
        >
          <Avatar
            size="md"
            variant="circular"
            src={feed.profiles?.icon_image_url || "/img/placeholder_user.png"}
            alt="user profile"
            onClick={handleMoveToUserProfile}
          />
          <div
            className="flex-1 flex flex-col"
            onClick={handleMoveToUserProfile}
          >
            <div className="text-md font-semibold">{feed.profiles?.name}</div>
            <div className="text-sm flex items-center">
              {/* Frontend Lead @ Google
            <span> • </span> */}
              {feed.category && (
                <PositionTag tag={FEED_CATEGORIES[feed.category!]} />
              )}
              {/* <span className="text-sm">
                    [{FEED_CATEGORIES[feed.category!]}]
                  </span> */}
              <span className="ml-2">{filters.FROM_NOW(feed?.created_at)}</span>
            </div>
          </div>
          {/* {feed.category && (
          <div>
            <span className="text-sm">[{FEED_CATEGORIES[feed.category!]}]</span>
          </div>
        )} */}
        </CardHeader>
        <CardBody>
          <div className="mb-2">
            {feed.title && (
              <div className="flex items-center gap-x-2 mb-4">
                <div className="text-md font-bold">{feed.title}</div>
              </div>
            )}

            {shortContent ? (
              <>
                <p
                  ref={ref}
                  className={`whitespace-pre-wrap ${
                    !isReadingMore && "line-clamp-4"
                  }`}
                  style={{
                    overflowWrap: "break-word",
                  }}
                >
                  {ReactHtmlParser(filters.URLFY(feed.content) || "")}
                </p>
                {isTruncated && !isReadingMore && (
                  <button onClick={() => setIsReadingMore(true)}>더보기</button>
                )}
              </>
            ) : (
              <p
                className="whitespace-pre-wrap"
                style={{
                  overflowWrap: "break-word",
                }}
              >
                {ReactHtmlParser(filters.URLFY(feed.content) || "")}
              </p>
            )}

            {image && (
              <div className="relative pt-[100%] mt-2 h-[250px]" style={{}}>
                <Image
                  src={image}
                  alt="feed-image"
                  fill
                  priority
                  sizes="(max-width: 1200px) 276px, 150px"
                />
              </div>
            )}
          </div>

          {sitePreviewData && <PostSitePreview meta={sitePreviewData} />}
        </CardBody>
        <CardFooter className="pt-0 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className={`flex items-center gap-1.5 ${
                feed.like ? "text-red-400" : "text-white"
              }`}
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation()
                handleToggleLike()
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`w-5 h-5 ${!feed.like && "animate-bounce"}`}
                stroke={feed.like ? `currentColor` : "black"}
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g strokeLinecap="round" strokeLinejoin="round" />
                <g>
                  <path
                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                    fill="currentColor"
                  />
                </g>
              </svg>
              <span className="mt-1 text-sm font-semibold text-black">
                {/* 좋아요 */}
                {feed.count_of_likes}
              </span>
            </button>
            {showCommentBtn && (
              <button
                className="ml-2 flex items-center gap-1.5"
                onClick={() => router.push(`/posts/${feed.id}`)}
              >
                <ChatBubbleLeftEllipsisIcon className="w-6" />
                <span className="mt-1 text-sm font-semibold text-black">
                  {/* 댓글수 */}
                  {feed.count_of_comments}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-x-4">
            <button
              className=""
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation()
                handleCopyClipboard()
              }}
            >
              <ShareIcon className="w-5" />
            </button>
            {/* <button onClick={handleBookmark}>
              <BookmarkIcon className="w-5" />
            </button> */}
            {user?.id === feed.profile_id && (
              <button
                onClick={(event: React.MouseEvent) => {
                  event.stopPropagation()
                  setIsOpenModal(true)
                }}
              >
                <TrashIcon className="w-5" />
              </button>
            )}
          </div>
        </CardFooter>
      </Card>
      <Modal
        title="포스트 삭제"
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">정말 삭제하시겠습니까?</p>
        </div>

        <div className="mt-4 flex items-end justify-end gap-x-2">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => setIsOpenModal(false)}
          >
            취소
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-300 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={handleDeleteFeedItem}
          >
            확인
          </button>
        </div>
      </Modal>
      <Toaster />
    </>
  )
}
