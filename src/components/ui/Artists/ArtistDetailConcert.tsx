import React from "react"
import { useParams } from "next/navigation"
import { useDidUpdate } from "@toss/react"
import { useInView } from "react-intersection-observer"
import { getConcertsByArtist } from "@/apis/concert"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"

const ArtistDetailConcert = () => {
  const params = useParams()

  const { data: concerts } = useQuery({
    queryKey: ["artist_concerts", params.id],
    suspense: false,
    queryFn: () => getConcertsByArtist(Number(params.id)),
  })

  const [ref, inView] = useInView({
    delay: 300,
    threshold: 1,
  })

  //   useDidUpdate(() => {
  //     if (inView && hasNextPage) {
  //       fetchNextPage()
  //     }
  //   }, [inView, hasNextPage])

  return (
    <div id="top">
      {/* {isLoading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
          <ConcertSkeleton />
        </div>
      )} */}
      {/* <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-5 gap-4 mb-2">
        {data?.pages.map(
          page =>
            page?.concerts?.map((concert: any) => (
              <Link
                key={concert.id}
                href={`/concerts/${concert.id}`}
                prefetch={false}
              >
                <ConcertCard item={concert} />
              </Link>
            )),
        )}
      </div> */}
    </div>
  )
}

export default ArtistDetailConcert
