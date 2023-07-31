import { Suspense } from "react"
import DataProvider from "./DataProvider"
import Loading from "./loading"

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <DataProvider pageId={params.id} />
    </Suspense>
  )
}
