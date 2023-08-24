import { Suspense } from "react"
import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import Loading from "./loading"
import JobDataProvider from "./components/JobDataProvider"

export default function Recruits() {
  return (
    <div className="sm:container mx-auto mt-8 px-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">채용</h2>
        <ChipButton url="/jobs/create" title="채용등록" />
      </div>
      <Suspense fallback={<Loading />}>
        <JobDataProvider />
      </Suspense>
    </div>
  )
}
