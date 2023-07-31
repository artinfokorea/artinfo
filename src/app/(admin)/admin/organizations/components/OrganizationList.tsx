"use client"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { fetchOrganizations } from "../api"
import Table from "@/components/ui/Table/Table"

interface IInquiry {
  id: string
  title: string
  contents: string
  email: string
  created_at: string
}

export default function OrganizationList() {
  const [page, setPage] = useState(1)

  const { data: organizations } = useQuery({
    queryKey: ["organizations"],
    suspense: true,
    queryFn: () => fetchOrganizations(page),
  })

  const ths = [
    { title: "번호", value: "id" },
    { title: "이름", value: "name" },
  ]

  return (
    <div>
      {organizations && (
        <Table
          ths={ths}
          items={organizations.organizations}
          to="organizations"
        />
      )}
    </div>
  )
}
