"use client"

import React from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchLesson } from "@/app/Api"

interface Props {
  pageId: string
}

const EducationDetailContainer = ({ pageId }: Props) => {
  const { data: lesson } = useQuery({
    queryKey: ["lesson", pageId],
    suspense: true,
    queryFn: () => fetchLesson(Number(pageId)),
  })

  return <div>hihi</div>
}

export default EducationDetailContainer
