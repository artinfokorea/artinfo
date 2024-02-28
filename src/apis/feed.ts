import { FEED, FEED_CATEGORIES } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface FeedsRequest {
  artistId?: number
  page: number
  requestUserId?: string
  category?: FEED_CATEGORIES
}

interface FeedPayload {
  userId: number
  artistId: number
  title: string
  contents: string
  imageUrls?: string[]
}

export const getFeedList = async ({
  artistId,
  page,
  requestUserId,
  category,
}: FeedsRequest): Promise<FEED[]> => {
  try {
    const payload = {
      page,
      artistId,
      size: 20,
      requestUserId,
      category,
    }
    const response: FEED[] = await apiRequest.get<FEED[]>("/feeds", {
      params: payload,
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getFeedList error"))
  }
}

export const getFeed = async (id: number, userId?: string): Promise<FEED> => {
  try {
    const response = await apiRequest.get<FEED>(`/feeds/${id}`, {
      params: {
        requestUserId: userId,
      },
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getFeed error"))
  }
}

export const getFeeds = async ({
  page,
  requestUserId,
  category,
}: FeedsRequest): Promise<any> => {
  const response = await getFeedList({ page, requestUserId, category })
  return {
    feeds: response,
    nextPage: page + 1,
    isLast: response.length < 20,
  }
}

export const createFeed = async (payload: FeedPayload) => {
  try {
    const response = await apiRequest.post<FEED>("/feeds", payload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createFeed error"))
  }
}
