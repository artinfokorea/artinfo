import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import Container from "./Container"

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <Container jobId={Number(params.id)} />
    </Suspense>
  )
}
