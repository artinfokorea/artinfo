"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Table from "@/components/ui/Table/Table"
import { Pagination } from "@/components/Common/Pagination"
import { fetchInquiries } from "../api"

export default function InquiryList() {
  const [page, setPage] = useState(1)

  const { data: inquiries } = useQuery({
    queryKey: ["inquiries"],
    suspense: true,
    queryFn: () => fetchInquiries(page),
  })

  const ths = [
    { title: "번호", value: "id" },
    { title: "제목", value: "title" },
    { title: "답변받을 이메일", value: "email" },
    { title: "작성시간", value: "created_at" },
  ]

  return (
    <div>
      {inquiries && (
        <>
          <Table ths={ths} items={inquiries?.inquiries} to="inquiries" />
          <Pagination
            page={page}
            setPage={setPage}
            totalCount={inquiries?.count as number}
          />
        </>
      )}
    </div>
  )
}
