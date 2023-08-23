"use client"

import { useParams } from "next/navigation"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchJob } from "../api"
import JobContainer from "../components/JobContainer"

const page = () => {
  const jobId = useParams().id

  const { data: job } = useQuery({
    queryKey: ["organizations", jobId],
    suspense: true,
    queryFn: () => fetchJob(Number(jobId)),
  })

  console.log("job", job)

  return <JobContainer job={job} />
}

export default page
