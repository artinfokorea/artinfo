import { LESSON } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface LessonsRequest {
  page: number
  location: string[]
  majors: string[]
}

export const getLessonList = async ({
  page,
  location,
  majors,
}: LessonsRequest): Promise<LESSON[]> => {
  try {
    const payload: any = { page, size: 20 }
    const filteredLocation = location?.map(loc => loc.replace(" 전체", ""))
    if (location.length > 0) {
      payload.location = filteredLocation.join(",")
    }
    if (majors.length > 0) payload.major = majors.join(",")
    const response: LESSON[] = await apiRequest.get<LESSON[]>("/lessons", {
      params: payload,
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getFeeds error"))
  }
}

export const getLesson = async (id: number) => {
  try {
    const response = await apiRequest.get<LESSON>(`/lessons/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getLesson error"))
  }
}
