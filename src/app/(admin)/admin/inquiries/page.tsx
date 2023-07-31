import React, { Suspense } from "react"
import InquiryDataProvider from "./components/InquiryDataProvider"
import Loading from "./loading"

const page = () => {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <h2 className="text-2xl font-bold mb-4">문의</h2>

      <Suspense fallback={<Loading />}>
        <InquiryDataProvider />
      </Suspense>
    </div>
  )
}

export default page
