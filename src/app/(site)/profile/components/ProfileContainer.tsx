"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchProfile } from "@/app/Api"
import { Spinner } from "@material-tailwind/react"
import ProfileCard from "./ProfileCard"

interface IProps {
  userId: string
}

export default function ProfileContainer({ userId }: IProps) {
  const {
    data: user,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["user", userId],
    suspense: true,
    queryFn: () => fetchProfile(userId),
  })

  return (
    <div className="sm:container mx-auto my-2">
      {isLoading && <Spinner />}
      {user && <ProfileCard user={user[0]} refetch={refetch} />}
    </div>
  )
}
