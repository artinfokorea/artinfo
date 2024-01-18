import { Job, JobDetail } from "@/types/types"
import { apiRequest } from "./index"
import { exceptionHandler } from "./exception-handler"

interface JobsRequest {
  major?: string[]
  page: number
}

interface JobPayload {
  userId: string
  title: string
  companyName: string
  companyImageUrl: string
  contents: string
  linkUrl?: string
  majors?: string[]
}

export const getJobList = async ({
  major,
  page,
}: JobsRequest): Promise<Job[]> => {
  try {
    const payload: {
      page: number
      size: number
      major?: string
    } = {
      page,
      size: 20,
    }
    if (major && major.length > 0) {
      payload.major = major?.join(",")
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

export const createJob = async (payload: JobPayload) => {
  try {
    const response = await apiRequest.post<Job>("/jobs", payload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API createJob error"))
  }
}

export const updateJob = async (jobId: number, payload: JobPayload) => {
  try {
    const response = await apiRequest.put<Job>(`/jobs/${jobId}`, payload)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API updateJob error"))
  }
}

export const deleteJob = async (jobId: number) => {
  try {
    const response = await apiRequest.delete<Job>("/jobs", jobId)
    return response
  } catch (error) {
    throw new Error(exceptionHandler(error, "API deleteJob error"))
  }
}
