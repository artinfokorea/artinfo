import { YOUTUBE } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getYoutubeListByArtist = async (
  artistId: number,
): Promise<YOUTUBE[]> => {
  try {
    const response = await apiRequest.get<YOUTUBE[]>(
      `/youtubes/artist/${artistId}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getYoutubeListByArtist error"))
  }
}
