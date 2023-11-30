import { CONCERT } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getConcertsByArtist = async (
  artistId: number,
): Promise<CONCERT[]> => {
  try {
    const response = await apiRequest.get<CONCERT[]>(
      `/concerts/artist/${artistId}`,
    )
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getConcertsByArtist error"))
  }
}
