import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import JobDetailContainer from "@/components/ui/Job/JobDetailContainer"

export default function page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <JobDetailContainer jobId={Number(params.id)} />
    </Suspense>
  )
}
