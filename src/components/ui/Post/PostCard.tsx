"use client"

import Image from "next/image"
import {
  ShareIcon,
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
import { FEED, FEED_CATEGORIES, Feed } from "@/types/types"
import useFilters from "@/hooks/useFilters"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { clipboard } from "@toss/utils"
import { useAuth } from "@/components/ui/Auth/AuthProvider"
import useLocalforge from "@/hooks/useLocalforage"
import { fetchSiteMetaData } from "@/app/Api"
import useToast from "@/hooks/useToast"
import { Modal } from "@/components/common/Modal"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import PostSitePreview from "@/components/ui/Post/PostSitePreview"

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
  feed: FEED
  showCommentBtn?: boolean
  shortContent?: boolean
  handleUpdatePostLike: (payload: { like: boolean; post_id: number }) => void
  handleDeleteFeed: (id: number) => void
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
  const { successToast, errorToast } = useToast()
  const filters = useFilters()
  const images = feed.imageUrls?.length ? feed.imageUrls : null
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
    const siteUrl = filters.EXTRACT_URL(feed.contents)

    if (siteUrl) {
      fetchSiteData(siteUrl)
    }
  }, [feed.contents])

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}/posts/${feed.feedId}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      successToast("공유할 포스트 URL을 클립보드에 복사했어요!")
    }
  }

  const handleToggleLike = () => {
    if (!user) {
      errorToast("로그인이 필요합니다.")

      return
    }

    handleUpdatePostLike({
      like: !feed.isLiking,
      post_id: feed.feedId,
    })
  }

  const handleMoveToUserProfile = () => {
    router.push(`/profile/${feed.authorId}`)
  }

  const handleBookmark = () => {
    // openSnackbar("아직 지원하지 않는 기능입니다.", 2000)
  }

  const handleDeleteFeedItem = () => {
    setIsOpenModal(false)
    handleDeleteFeed(feed.feedId)
  }

  return (
    <>
      <Card
        className={`transition-transform transform cursor-pointer my-2 rounded-none md:rounded-md `}
        onClick={() => router.push(`/posts/${feed.feedId}`)}
      >
        <CardHeader
          shadow={false}
          floated={false}
          className="flex items-center gap-2"
        >
          <Avatar
            size="md"
            variant="circular"
            src={feed.authorIconImageUrl || "/img/placeholder_user.png"}
            alt="user profile"
            onClick={handleMoveToUserProfile}
          />
          <div
            className="flex-1 flex flex-col"
            onClick={handleMoveToUserProfile}
          >
            <div className="text-md font-semibold">{feed.authorName}</div>
            <div className="flex items-center">
              {/* <div className="text-sm flex items-center">
                {feed.category && (
                  <PositionTag tag={FEED_CATEGORIES[feed.!]} />
                )}
              </div> */}
              <span className="text-sm">
                {filters.FROM_NOW(feed?.createdAt)}
              </span>
            </div>
          </div>
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
                <div
                  ref={ref}
                  className={`whitespace-pre-wrap ${
                    !isReadingMore && "line-clamp-4"
                  }`}
                  style={{
                    overflowWrap: "break-word",
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: filters.URLFY(feed.contents) || "",
                    }}
                  />
                </div>
                {isTruncated && !isReadingMore && (
                  <button
                    className="mt-1 text-primary opacity-60 hover:opacity-100"
                    onClick={(event: React.MouseEvent) => {
                      event.stopPropagation()
                      setIsReadingMore(true)
                    }}
                  >
                    더보기
                  </button>
                )}
              </>
            ) : (
              <div
                className="whitespace-pre-wrap"
                style={{
                  overflowWrap: "break-word",
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: filters.URLFY(feed.contents) || "",
                  }}
                />
              </div>
            )}
            {images && (
              <div className="bg-white py-4 px-4 mt-4 drop-shadow-md shawdow-md rounded-lg overflow-x-auto">
                <Swiper
                  spaceBetween={10}
                  slidesPerView="auto"
                  modules={[Pagination]}
                >
                  {images?.map((image: any) => (
                    <SwiperSlide key={image} style={{ width: "100%" }}>
                      <div className="relative pt-[70%] mt-2 h-[250px] ">
                        <Image
                          src={image}
                          alt="feed-image"
                          fill
                          priority
                          quality={100}
                          className="px-5 md:px-20"
                          sizes="(max-width: 1200px) 276px, 150px"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {sitePreviewData && <PostSitePreview meta={sitePreviewData} />}
        </CardBody>
        <CardFooter className="pt-0 flex items-center justify-between">
          <div className="flex items-center">
            <button
              className={`flex items-center gap-1.5 ${
                feed.isLiking ? "text-red-400" : "text-white"
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
                className={`w-5 h-5 ${!feed.isLiking && "animate-bounce"}`}
                stroke={feed.isLiking ? `currentColor` : "black"}
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
                {feed.countOfLikes}
              </span>
            </button>
            {showCommentBtn && (
              <button
                className="ml-2 flex items-center gap-1.5"
                onClick={() => router.push(`/posts/${feed.feedId}`)}
              >
                <ChatBubbleLeftEllipsisIcon className="w-6" />
                <span className="mt-1 text-sm font-semibold text-black">
                  {/* 댓글수 */}
                  {feed.countOfComments}
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
            {user?.id === feed.authorId && (
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
    </>
  )
}
