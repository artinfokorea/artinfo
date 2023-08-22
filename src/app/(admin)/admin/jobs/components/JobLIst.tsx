"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Table from "@/components/ui/Table/Table"
import { Pagination } from "@/components/ui/Pagination"
import { fetchJobs } from "../api"

export default function JobList() {
  const [page, setPage] = useState(1)

  const { data: jobs } = useQuery({
    queryKey: ["jobs", page],
    suspense: true,
    queryFn: () => fetchJobs(page),
  })

  const ths = [
    { title: "번호", value: "id" },
    { title: "제목", value: "title" },
  ]

  return (
    <div>
      {jobs && (
        <>
          <Table ths={ths} items={jobs.jobs} to="jobs" />
          <Pagination
            page={page}
            setPage={setPage}
            totalCount={jobs?.count as number}
          />
        </>
      )}
    </div>
  )
}
