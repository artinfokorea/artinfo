import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import ListWithLatestJobs from "./components/ListWithLatestJobs"

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-screen-lg px-4 lg:px-0">
      <div className="flex pt-4">
        <div className="flex-1 overflow-hidden">{children}</div>
        <div className="ml-5 hidden md:block" style={{ width: 300 }}>
          <Suspense fallback={<Loading />}>
            <ListWithLatestJobs />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
