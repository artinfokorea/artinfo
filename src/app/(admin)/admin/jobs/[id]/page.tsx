"use client"

import { useRouter, useSearchParams } from "next/navigation"
import React from "react"

const page = () => {
  const params = useSearchParams()

  console.log("params", params.get("id"))
  return <div>hihi</div>
}

export default page
