import { QueryClient } from "@tanstack/react-query"
import { cache } from "react"

const GetQueryClient = cache(() => new QueryClient())
export default GetQueryClient
