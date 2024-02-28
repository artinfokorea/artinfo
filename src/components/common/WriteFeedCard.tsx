import useAuth from "@/hooks/useAuth"
import { Avatar, Card } from "@/components/material"
import { usePathname, useRouter } from "next/navigation"

interface Props {
  artistId?: number
  secret?: string
}

export default function WriteFeedCard({ artistId, secret }: Props) {
  const { user } = useAuth()
  const router = useRouter()

  const goToCreateFeed = () => {
    if (artistId) {
      router.push(`/create?artistId=${artistId}`)
    } else if (secret === "choir") {
      router.push(`/create?category=choir`)
    } else if (secret === "orchestra") {
      router.push(`/create?category=orchestra`)
    }
  }

  return (
    <Card className="overflow-hidden p-4 rounded-none md:rounded-md">
      <div className="flex items-center gap-x-4">
        {user && (
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-blue-500 p-0.5"
            src={
              user?.user_metadata.icon_image_url || "/img/placeholder_user.png"
            }
          />
        )}

        <div className="bg-gray-100 rounded-lg flex-1">
          {user && (
            <button className="block px-4 py-3" onClick={goToCreateFeed}>
              나누고 싶은 생각...
            </button>
          )}
          {!user && <div className="px-4 py-3">로그인이 필요합니다.</div>}
        </div>
      </div>
    </Card>
  )
}
