import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getUser = async (id: string) => {
  try {
    const response = await apiRequest.get(`/users/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getUser error"))
  }
}
