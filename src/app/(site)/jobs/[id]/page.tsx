import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Loading from "../loading"
import DataProvider from "./DataProvider"

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <DataProvider pageId={params.id} />
    </Suspense>
  )
}
