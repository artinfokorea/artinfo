import { apiRequest } from "."
import { exceptionHandler } from "./exception-handler"

type createRequest = {
  userId: string
  name: string
  companyName: string
  secretNickname?: string
  imageUrls: string[]
}

export const createCompanyCertification = async (payload: createRequest) => {
  try {
    const response = await apiRequest.post(
      "/users/me/company-certification",
      payload,
    )
    return response
  } catch (error) {
    throw new Error(
      exceptionHandler(error, "API createCompanyCertification error"),
    )
  }
}
