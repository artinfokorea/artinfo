import { Suspense } from "react"
import Loading from "@/components/ui/Loading/Loading"
import ProfileContainer from "../components/ProfileContainer"

interface IProps {
  params: {
    id: string
  }
}

export default async function Profile({ params }: IProps) {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileContainer userId={params.id} />
    </Suspense>
  )
}
