import useSupabase from "@/hooks/useSupabase"
import { redirect } from "next/navigation"
import ProfileCard from "./ProfileCard"

interface IProps {
  userId: string
}

export default async function ProfileContainer({ userId }: IProps) {
  const supabase = useSupabase()

  const user = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (!user.data) {
    redirect("/")
  }

  return (
    <div className="sm:container mx-auto mt-4 px-4">
      <ProfileCard user={user.data} />
    </div>
  )
}
