"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Table from "@/components/ui/Table/Table"
import { fetchInquiries } from "../api"

interface IInquiry {
  id: string
  title: string
  contents: string
  email: string
  created_at: string
}

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
      {inquiries && <Table ths={ths} items={inquiries} to="inquiries" />}
      {/* <Pagination page={1} totalCount={10} /> */}
    </div>
  )
}
