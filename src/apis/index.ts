import axios, { AxiosRequestConfig } from "axios"

const baseURL = process.env.NEXT_PUBLIC_REST_API

const baseInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": `application/json`,
  },
})

baseInstance.interceptors.response.use(({ data }) => data)

interface ApiRequestMethods {
  get<T>(url: string, request?: AxiosRequestConfig): Promise<T>
}

export const apiRequest: ApiRequestMethods = {
  get: (url, request) => {
    console.log("🧸 get", { url, request })
    return baseInstance.get(url, request)
  },
}
