import { ARTIST_CONCERT, CONCERT, CONCERT_CATEGORY } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface ConcertsRequest {
  page: number
  keyword?: string
}

export const getConcertsByArtist = async (
  artistId: number,
): Promise<ARTIST_CONCERT[]> => {
  try {
    const response = await apiRequest.get<ARTIST_CONCERT[]>(
      `/concerts/artist/${artistId}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getConcertsByArtist error"))
  }
}

export const getConcertLists = async ({
  page,
  keyword,
}: ConcertsRequest): Promise<CONCERT[]> => {
  try {
    const payload: ConcertsRequest = {
      page,
    }
    if (keyword) {
      payload.keyword = keyword
    }
    const size = 20
    const response = await apiRequest.get<CONCERT[]>("/concerts", {
      params: { ...payload, size },
    })

    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getConcertLists error"))
  }
}

export const getConcertKeywords = async (size: number): Promise<string[]> => {
  try {
    const response = await apiRequest.get<string[]>("/concerts/keywords", {
      params: { size },
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getConcertKeywords error"))
  }
}
