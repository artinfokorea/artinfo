import { LESSON } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface LessonsRequest {
  page: number
  location: string[]
  subjects: string[]
}

export const getLessonList = async ({
  page,
  location,
  subjects,
}: LessonsRequest): Promise<LESSON[]> => {
  try {
    const payload: any = { page, size: 12 }
    // const filteredLocation = location?.map(loc => loc.replace(" 전체", ""))
    // if (location.length > 0) {
    //   payload.location = filteredLocation.join(",")
    // }
    // if (subjects.length > 0) payload.subjects = subjects.join(",")
    const response: LESSON[] = await apiRequest.get("/lessons", {
      params: payload,
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getFeeds error"))
  }
}

// export const getFeed = async (feedId: string) => {
//   try {
//     const response = await apiRequest.get<Feed>(`/feed/${feedId}`)
//     return response
//   } catch (error) {
//     throw new Error(exceptionHandler(error, "API getFeed error"))
//   }
// }
