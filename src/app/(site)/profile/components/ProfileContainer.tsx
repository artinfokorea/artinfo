"use client"

import useSupabase from "@/hooks/useSupabase"
import { useQuery } from "@tanstack/react-query"
import { fetchProfile } from "@/app/Api"
import { Spinner } from "@material-tailwind/react"
import ProfileCard from "./ProfileCard"

interface IProps {
  userId: string
}

export default function ProfileContainer({ userId }: IProps) {
  const supabase = useSupabase()

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
    <div className="sm:container mx-auto mt-4 px-4">
      {isLoading && <Spinner />}
      {user && <ProfileCard user={user[0]} refetch={refetch} />}
    </div>
  )
}
