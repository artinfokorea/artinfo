import { USER } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

export const getUser = async (id: string): Promise<USER> => {
  try {
    const response = await apiRequest.get<USER>(`/users/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getUser error"))
  }
}
