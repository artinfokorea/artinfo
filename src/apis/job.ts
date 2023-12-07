import { Job, JobDetail } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface JobsRequest {
  major?: string[]
  page: number
}

interface JobPayload {
  userId: number
  artistId: number
  title: string
  contents: string
  imageUrls?: string[]
}

export const getJobList = async ({
  major,
  page,
}: JobsRequest): Promise<Job[]> => {
  try {
    const payload = {
      page,
      major: major?.join(","),
      size: 12,
    }
    const response: Job[] = await apiRequest.get<Job[]>("/jobs", {
      params: payload,
    })
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJobList error"))
  }
}

export const getJob = async (id: number): Promise<JobDetail> => {
  try {
    const response = await apiRequest.get<JobDetail>(`/jobs/${id}`)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API getJob error"))
  }
}

// export const createFeed = async (payload: FeedPayload) => {
//   try {
//     const response = await apiRequest.post<FEED>("/feeds", payload)
//     return response
//   } catch (error) {
//     throw new Error(exceptionHandler(error, "API createFeed error"))
//   }
// }
