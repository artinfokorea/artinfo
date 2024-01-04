import { STATISTICS } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getStatistics = async (): Promise<STATISTICS> => {
  try {
    const response = await apiRequest.get<STATISTICS>("/statistics")
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getStatistics error"))
  }
}

export const increaseOfVisitors = async () => {
  try {
    await apiRequest.post("/statistics/visitors")
  } catch (error) {
    throw new Error(exceptionHandler(error, "API increaseOfVisitors error"))
  }
}
