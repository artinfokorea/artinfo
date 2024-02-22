import { USER } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

type updateMeRequest = {
  userId: string
  name?: string
  secretNickname?: string
  publicNickname?: string
  iconImageUrl?: string
}

export const getUser = async (id: string): Promise<USER> => {
  try {
    const response = await apiRequest.get<USER>(`/users/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getUser error"))
  }
}

export const getMe = async (id: string): Promise<USER> => {
  try {
    const response = await apiRequest.get<USER>(`/users/me/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getUser error"))
  }
}

export const updateMe = async (payload: updateMeRequest): Promise<USER> => {
  try {
    const response = await apiRequest.patch<USER>("/users/me", payload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateMe error"))
  }
}
