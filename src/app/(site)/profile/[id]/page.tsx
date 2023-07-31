import { Suspense } from "react"
import ProfileContainer from "../components/ProfileContainer"
import Loading from "./loading"

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
