import { Suspense } from "react"
import Loading from "@/components/Common/Loading"
import Container from "../../components/ui/Post/Container"

export const revalidate = 10 // revalidate this page every 60 seconds

export default function Index() {
  return (
    <Suspense fallback={<Loading />}>
      <Container />
    </Suspense>
  )
}
