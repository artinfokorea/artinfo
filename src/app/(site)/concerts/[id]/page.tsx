import GetQueryClient from "@/app/GetQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import ConcertDetailContainer from "@/components/ui/Concert/ConcertDetailContainer"
import { getConcert } from "@/apis/concert"
import { Metadata } from "next"
import { PageType } from "@/interface/common"
import { ConcertDetailServerContainer } from "@/components/ui/Concert/ConcertDetailServerContainer"

type Props = {
  params: { id: string }
  searchParams?: { [key: string]: PageType }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const queryClient = GetQueryClient()
  const data = await queryClient.fetchQuery(["concert", id], () =>
    getConcert(id),
  )

  const pageTitle = data?.title.substring(0, 35)
  const pageImage = data?.posterUrl

  return {
    title: `공연 | ${pageTitle}`,
    description: `${pageTitle} | 아트인포`,
    openGraph: {
      title: pageTitle,
      description: "아트인포 공연",
      images: {
        url:
          pageImage ??
          "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/concerts/288/1694427064047.jpg",
        alt: "아트인포-ARTINFO",
      },
    },
  }
}

export default async function page({ params, searchParams }: Props) {
  const { id } = params
  const queryClient = GetQueryClient()
  // await queryClient.prefetchQuery(["concert", params.id], () =>
  //   getConcert(params.id),
  // )

  // const dehydratedState = dehydrate(queryClient)

  const data = await queryClient.fetchQuery(["concert", id], () =>
    getConcert(id),
  )

  return (
    <div className="touch-auto pt-6 pb-20 md:pb-0">
      {/* <Hydrate state={dehydratedState}> */}
      {/* <ConcertDetailContainer pageId={id} /> */}
      {/* </Hydrate> */}
      <ConcertDetailServerContainer
        pageId={id}
        concert={data}
        searchParams={searchParams}
      />
    </div>
  )
}
