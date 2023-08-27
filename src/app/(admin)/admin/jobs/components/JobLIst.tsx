"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import JobTable from "@/components/ui/Table/JobTable"
import useSupabase from "@/hooks/useSupabase"
import { Pagination } from "@/components/ui/Pagination"
import useSnackbar from "@/hooks/useSnackbar"
import { fetchJobs } from "../api"

export default function JobList() {
  const [page, setPage] = useState(1)
  const supabase = useSupabase()
  const [openSnackbar, closeSnackbar] = useSnackbar({
    position: "top-center",
    style: {
      // backgroundColor: "red",
    },
  })

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
        openSnackbar("삭제 실패", 2000)
      }
      refetch()
    } catch (error: any) {
      openSnackbar(`데이터 삭제 중 오류 발생:${error.message}`, 2000)
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
