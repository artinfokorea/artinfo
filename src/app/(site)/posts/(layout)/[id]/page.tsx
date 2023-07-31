import { Suspense } from "react"
import Loading from "../loading"
import { DataProvider } from "./DataProvider"

export default function PostDetail({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-screen-lg">
      <Suspense fallback={<Loading />}>
        <DataProvider pageId={params.id} />
      </Suspense>
    </div>
  )
}
