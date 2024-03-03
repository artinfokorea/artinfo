import { deleteFeed, updatePostLike } from "@/app/Api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { FEED } from "@/types/types"
import useToast from "./useToast"

export const useFeedMutation = () => {
  const queryClient = useQueryClient()
  const { errorToast, successToast } = useToast()
  const pathname = usePathname()

  const updateFeedLikeMutation = useMutation({
    mutationFn: (payload: {
      like: boolean
      user_id: string
      post_id: number
    }) => {
      return updatePostLike(payload)
    },
    onMutate: updateLike => {
      queryClient.setQueryData(["feeds", pathname], (old: any) => {
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
  })

  const deleteFeedMutation = useMutation({
    mutationFn: (feedId: number) => {
      return deleteFeed(feedId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["feeds", pathname])
      successToast("게시글이 삭제되었습니다.")
    },
  })

  return
}
