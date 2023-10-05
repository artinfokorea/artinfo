import React, { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import EducationContainer from "@/components/ui/Education/EducationContainer"

const page = () => {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <div>
        <h2 className="text-2xl font-bold mb-4">교육</h2>
      </div>
      <Suspense fallback={<Loading />}>
        <EducationContainer />
      </Suspense>
    </div>
  )
}

export default page
