"use client"

import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/apis/user"
import ProfileCard from "./ProfileCard"

interface IProps {
  userId: string
}

export default function ProfileContainer({ userId }: IProps) {
  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getMe(userId),
  })

  console.log("getUser", user)

  return (
    <div className="sm:container mx-auto my-2">
      {user && <ProfileCard user={user} />}
    </div>
  )
}
