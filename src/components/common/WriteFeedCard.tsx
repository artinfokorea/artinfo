import useAuth from "@/hooks/useAuth"
import { Avatar, Card } from "@/components/material"
import { useRouter } from "next/navigation"

interface Props {
  artistId: number
}

export default function WriteFeedCard({ artistId }: Props) {
  const { user } = useAuth()
  const router = useRouter()

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
            <button
              className="block px-4 py-3"
              onClick={() => {
                router.push(`/create?artistId=${artistId}`)
              }}
            >
              나누고 싶은 생각...
            </button>
          )}
          {!user && <div className="px-4 py-3">로그인이 필요합니다.</div>}
        </div>
      </div>
    </Card>
  )
}
