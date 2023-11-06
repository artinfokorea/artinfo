import { Suspense } from "react"
import FeedSkeleton from "@/components/ui/Skeleton/FeedSkeleton"
import Container from "../../components/ui/Post/Container"

export const revalidate = 10 // revalidate this page every 60 seconds

export default function Index() {
  return (
    <Suspense
      fallback={
        <>
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
          <FeedSkeleton />
        </>
      }
    >
      <Container />
    </Suspense>
  )
}
