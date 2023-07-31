import { Suspense } from "react"
import Loading from "./loading"
import { DataProvider } from "./DataProvider"

export const revalidate = 10 // revalidate this page every 60 seconds

export default function Posts() {
  return (
    <>
      {/* <h2>포스트</h2> */}
      <Suspense fallback={<Loading />}>
        <DataProvider />
      </Suspense>
    </>
  )
}
