"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import JobTable from "@/components/ui/Table/JobTable"
import useSupabase from "@/hooks/useSupabase"
import { Pagination } from "@/components/ui/Pagination"
import { fetchJobs } from "../api"

export default function JobList() {
  const [page, setPage] = useState(1)
  const supabase = useSupabase()

  const { data: jobs, refetch } = useQuery({
    queryKey: ["recruit_jobs", page],
    suspense: true,
    queryFn: () => fetchJobs(page),
  })

  const ths = [
    { title: "번호", value: "id" },
    { title: "제목", value: "title" },
  ]

  const deleteJob = async (id: number) => {
    try {
      const { error } = await supabase
        .from("recruit_jobs")
        .delete()
        .eq("id", id)

      if (error) {
        throw new Error("삭제실패")
      }
      refetch()
    } catch (error: any) {
      throw new Error("삭제실패")
    }
  }

  return (
    <div>
      {jobs && (
        <>
          <JobTable
            ths={ths}
            items={jobs.jobs}
            to="jobs"
            handleDelete={deleteJob}
          />
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
