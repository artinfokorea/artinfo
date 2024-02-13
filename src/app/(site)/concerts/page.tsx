import { ChipButton } from "@/components/ui/Button/LinkChipButton"
import GetQueryClient from "@/app/GetQueryClient"
import { getConcertKeywords, getConcerts } from "@/apis/concert"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import ConcertContainer from "../../../components/ui/Concert/ConcertContainer"

interface Props {
  searchParams: { keyword: string }
}
export default async function Concerts({ searchParams: { keyword } }: Props) {
  const queryClient = GetQueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["concerts", keyword],
    queryFn: () => {
      return getConcerts(1, keyword)
    },
  })

  await queryClient.prefetchQuery({
    queryKey: ["keywordList"],
    queryFn: () => getConcertKeywords(5),
    staleTime: 1000 * 60 * 60 * 24,
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <div className="sm:container mx-auto pt-4 px-4 ">
      <div className="flex justify-between mt-4">
        <h2 className="text-2xl font-bold mb-4">공연</h2>
        <ChipButton url="/concerts/create" title="공연등록" />
      </div>
      <Hydrate state={dehydratedState}>
        <ConcertContainer />
      </Hydrate>
    </div>
  )
}
