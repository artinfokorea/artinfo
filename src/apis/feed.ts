import { FEED } from "@/types/types"
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

export const createFeed = async (payload: FeedPayload) => {
  try {
    const response = await apiRequest.post<FEED>("/feeds", payload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createFeed error"))
  }
}
