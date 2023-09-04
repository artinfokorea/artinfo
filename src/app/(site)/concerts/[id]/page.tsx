import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import DataProvider from "./DataProvider"

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <DataProvider pageId={params.id} />
    </Suspense>
  )
}
