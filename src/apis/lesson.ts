import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getLessonList = async () => {
  try {
    const response = await apiRequest.get("/lessons", {
      params: {},
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
