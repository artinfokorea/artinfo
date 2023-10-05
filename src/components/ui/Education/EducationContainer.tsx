"use client"

import React, { useState } from "react"
import { Pagination } from "@/components/common/Pagination"
import EducationTable from "./EducationTable"

const EducationContainer = () => {
  const [page, setPage] = useState(1)
  return (
    <div>
      <EducationTable />
      <Pagination page={page} setPage={setPage} totalCount={120} />
    </div>
  )
}

export default EducationContainer
