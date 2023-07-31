import { Suspense } from "react"
import Loading from "./loading"
import ConcertDataProvider from "./components/ConcertDataProvider"

export default function Concerts() {
  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <h2 className="text-2xl font-bold mb-4">공연</h2>
      <Suspense fallback={<Loading />}>
        <ConcertDataProvider />
      </Suspense>
    </div>
  )
}
