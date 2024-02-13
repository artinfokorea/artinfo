"use client"

import { getArtists } from "@/apis/artist"
import { ARTIST } from "@/types/types"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import Link from "next/link"
import ArtistsCard from "./ArtistCard"
import ArtistSkeleton from "../Skeleton/ArtistSkeleton"

const ArtistsContainer = () => {
  const { isLoading, data } = useInfiniteQuery(
    ["artists"],
    ({ pageParam = 1 }) => {
      return getArtists(pageParam)
    },
    {
      getNextPageParam: lastPage => {
        if (!lastPage.isLast) return lastPage.nextPage
        return null
      },
    },
  )

  return (
    <div id="top" className="max-w-screen-lg mx-auto pt-8 px-4">
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
