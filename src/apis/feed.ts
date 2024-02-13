import { FEED } from "@/types/types"
import { fetchFeeds } from "@/app/Api"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface FeedsRequest {
  artistId: number
  page: number
  requestUserId?: string
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
}: FeedsRequest): Promise<FEED[]> => {
  try {
    const payload = {
      page,
      artistId,
      size: 12,
      requestUserId,
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

export const getFeeds = async (pageParam: number): Promise<any> => {
  const response = await fetchFeeds({ pageParam })
  return {
    feeds: response,
    nextPage: pageParam + 1,
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
