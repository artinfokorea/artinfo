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
import { useRouter } from "next/navigation"
import { clipboard } from "@toss/utils"
import { useAuth } from "@/app/(auth)/auth/components/AuthProvider"
import useSnackbar from "@/hooks/useSnackbar"
import useLocalforge from "@/hooks/useLocalforage"
import { fetchSiteMetaData } from "@/app/Api"
import { Modal } from "@/components/ui/Modal"
import ReactHtmlParser from "react-html-parser"
import PostSitePreview from "./PostSitePreview"

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

  const ref = useRef(null)
  const { isTruncated, isReadingMore, setIsReadingMore } = useTruncatedElement({
    ref,
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

  const [openSnackbar, closeSnackbar] = useSnackbar({
    position: "top-center",
    style: {
      // backgroundColor: "red",
    },
  })

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}/posts/${feed.id}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      openSnackbar("공유할 포스트 URL을 클립보드에 복사했어요!", 2000)
    }
  }

  const handleToggleLike = () => {
    if (!user) {
      openSnackbar("로그인이 필요합니다.", 2000)
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
    openSnackbar("아직 지원하지 않는 기능입니다.", 2000)
  }

  const handleDeleteFeedItem = () => {
    setIsOpenModal(false)
    if (handleDeleteFeed) {
      handleDeleteFeed(feed.id)
    }
  }

  return (
    <>
      <Card
        className="transition-transform transform hover:scale-95 cursor-pointer"
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
            <div className="text-xs -mt-0.5">
              {/* Frontend Lead @ Google
            <span> • </span> */}
              {feed.category && (
                <>
                  <span className="text-sm">
                    [{FEED_CATEGORIES[feed.category!]}]
                  </span>
                  <span> • </span>
                </>
              )}
              {filters.FROM_NOW(feed.created_at)}
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
              <div className="relative pt-[100%] mt-2" style={{}}>
                <Image
                  src={image}
                  alt="아트인포"
                  objectFit="cover"
                  fill
                  className="w-full h-full top-0 left-0 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          {sitePreviewData && <PostSitePreview meta={sitePreviewData} />}
        </CardBody>
        <CardFooter className="pt-0 flex items-center justify-between">
          <button
            className={`flex items-center gap-1.5 ${
              feed.like ? "text-red-400" : "text-white"
            }`}
            onClick={() => handleToggleLike()}
          >
            {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${!feed.like && "animate-bounce"}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg> */}
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

          <div className="flex items-center gap-x-4">
            <button className="" onClick={() => handleCopyClipboard()}>
              <ShareIcon className="w-5" />
            </button>
            <button onClick={handleBookmark}>
              <BookmarkIcon className="w-5" />
            </button>
            {showCommentBtn && (
              <button onClick={() => router.push(`/posts/${feed.id}`)}>
                <ChatBubbleLeftEllipsisIcon className="w-5" />
              </button>
            )}
            {user?.id === feed.profile_id && (
              <button onClick={() => setIsOpenModal(true)}>
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
    </>
  )
}
