import { ARTIST } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface ArtistsRequest {
  page: number
}

export const getArtistList = async ({
  page,
}: ArtistsRequest): Promise<ARTIST[]> => {
  try {
    const payload = {
      page,
      size: 20,
    }
    const response: ARTIST[] = await apiRequest.get<ARTIST[]>("/artists", {
      params: payload,
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getArtists error"))
  }
}

export const getArtists = async (pageParam: number): Promise<any> => {
  const response = await getArtistList({ page: pageParam })
  return {
    artists: response,
    nextPage: pageParam + 1,
    isLast: response.length < 20,
  }
}

export const getArtist = async (id: number) => {
  try {
    const response = await apiRequest.get<ARTIST>(`/artists/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getArtist error"))
  }
}
