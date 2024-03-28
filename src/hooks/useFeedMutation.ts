import { deleteFeed, updatePostLike } from "@/app/Api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams, usePathname } from "next/navigation"
import { FEED } from "@/types/types"
import useToast from "./useToast"
import useAuth from "./useAuth"

interface Props {
  type: "post" | "artist" | "secret"
}

export const useFeedMutation = ({ type }: Props) => {
  const queryClient = useQueryClient()
  const { errorToast, successToast } = useToast()
  const pathname = usePathname()
  const { user } = useAuth()
  const params = useParams()

  const { mutate: updateFeedLike } = useMutation({
    mutationFn: (payload: {
      like: boolean
      user_id: string
      post_id: number
    }) => {
      return updatePostLike(payload)
    },
    onMutate: updateLike => {
      const queryKey = ["feeds"]

      if (type === "post" && user?.id) queryKey.push(user.id)
      if (type === "artist" && params.id) queryKey.push(params.id as string)
      if (type === "secret" && pathname) queryKey.push(pathname)

      queryClient.setQueryData(queryKey, (old: any) => {
        const pages = [...old.pages]

        pages.forEach(page => {
          page.feeds.forEach((feed: FEED) => {
            if (feed.feedId === updateLike.post_id) {
              // eslint-disable-next-line no-param-reassign
              feed.isLiking = updateLike.like
              if (updateLike.like) {
                // eslint-disable-next-line no-param-reassign
                feed.countOfLikes += 1
              } else {
                // eslint-disable-next-line no-param-reassign
                feed.countOfLikes -= 1
              }
            }
          })
        })
        return {
          pages,
          pageParams: [...old.pageParams],
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feeds", pathname])
      queryClient.invalidateQueries(["feeds", user?.id])
      queryClient.invalidateQueries(["feeds", params.id])
    },
  })

  const { mutate: deleteFeedMutate } = useMutation({
    mutationFn: (feedId: number) => {
      return deleteFeed(feedId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feeds", pathname])
      queryClient.invalidateQueries(["feeds", user?.id])
      queryClient.invalidateQueries(["feeds", params.id])
      successToast("게시글이 삭제되었습니다.")
    },
  })

  return { updateFeedLike, deleteFeedMutate }
}
