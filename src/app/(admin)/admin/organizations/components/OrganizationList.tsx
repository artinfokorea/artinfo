"use client"

import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import Table from "@/components/ui/Table/Table"
import { Pagination } from "@/components/common/Pagination"
import { fetchOrganizations } from "../api"

export default function OrganizationList() {
  const [page, setPage] = useState(1)

  const { data: organizations } = useQuery({
    queryKey: ["organizations", page],
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
        <>
          <Table
            ths={ths}
            items={organizations.organizations}
            to="organizations"
          />
          <Pagination
            page={page}
            setPage={setPage}
            totalCount={organizations?.count as number}
          />
        </>
      )}
    </div>
  )
}
