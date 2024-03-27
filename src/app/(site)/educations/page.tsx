import React, { useEffect, useState, useMemo } from "react"
import EducationContainer from "@/components/ui/Education/EducationContainer"
import GetQueryClient from "@/app/GetQueryClient"
import { getLessons } from "@/apis/lesson"
import { Hydrate, dehydrate } from "@tanstack/react-query"

interface Props {
  searchParams: { majors: string; regions: string }
}

const page = async ({ searchParams: { majors, regions } }: Props) => {
  // const queryClient = GetQueryClient()
  // const majorList = majors ? majors.split(",") : []
  // const regionList = regions ? regions.split(",") : []

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["lessons", regionList, majorList],
  //   queryFn: () => {
  //     return getLessons(1, regionList, majorList)
  //   },
  // })

  // const dehydratedState = dehydrate(queryClient)

  return (
    // <Hydrate state={dehydratedState}>
    <EducationContainer />
    // </Hydrate>
  )
}

export default page
