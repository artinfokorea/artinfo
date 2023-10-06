import React, { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import EducationContainer from "@/components/ui/Education/EducationContainer"

const page = () => {
  return (
    <div className="mx-auto max-w-screen-lg">
      <div className="flex justify-between mt-4 px-2">
        <h2 className="text-2xl font-bold mb-4">레슨</h2>
        <ChipButton url="/educations/create" title="레슨등록" />
      </div>
      <Suspense fallback={<Loading />}>
        <EducationContainer />
      </Suspense>
    </div>
  )
}

export default page
