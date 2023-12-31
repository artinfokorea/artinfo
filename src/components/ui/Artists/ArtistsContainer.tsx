"use client"

import { getArtistList } from "@/apis/artist"
import { ARTIST } from "@/types/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import Link from "next/link"
import ArtistsCard from "./ArtistCard"
import ArtistSkeleton from "../Skeleton/ArtistSkeleton"

const ArtistsContainer = () => {
  const getConcerts = async (pageParam: number): Promise<any> => {
    const response = await getArtistList({ page: pageParam })
    return {
      artists: response,
      nextPage: pageParam + 1,
      isLast: response.length < 20,
    }
  }

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["artists"],
    ({ pageParam = 1 }) => {
      return getConcerts(pageParam)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      suspense: false,
    },
  )

  return (
    <div id="top">
      {isLoading && (
        <div className="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-2">
          <ArtistSkeleton />
          <ArtistSkeleton />
          <ArtistSkeleton />
          <ArtistSkeleton />
          <ArtistSkeleton />
          <ArtistSkeleton />
        </div>
      )}
      <div className="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-2">
        {data?.pages.map(
          page =>
            page?.artists.map((artist: ARTIST) => (
              <Link href={`/artists/${artist.id}`} key={artist.id}>
                <ArtistsCard key={artist.id} artist={artist} />
              </Link>
            )),
        )}
      </div>
    </div>
  )
}

export default ArtistsContainer
