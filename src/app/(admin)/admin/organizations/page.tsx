import React, { Suspense } from "react"
import OrganizationsDataProvider from "./components/OrganizationsDataProvider"
import Loading from "./loading"

const page = () => {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <h2 className="text-2xl font-bold mb-4">기관</h2>

      <Suspense fallback={<Loading />}>
        <OrganizationsDataProvider />
      </Suspense>
    </div>
  )
}

export default page
