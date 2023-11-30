"use client"

import React, { useState } from "react"
import { Tab } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { getArtist } from "@/apis/artist"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Spinner } from "@material-tailwind/react"
import ArtistDetailFeed from "./ArtistDetailFeed"
import ArtistDetailConcert from "./ArtistDetailConcert"
import ArtistDetailYoutube from "./ArtistDetailYoutube"

const tabList = ["피드", "공연", "영상"]

const ArtistDetailContatiner = () => {
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  const { data: artist } = useQuery({
    queryKey: ["artist", params.id],
    suspense: false,
    queryFn: () => getArtist(Number(params.id)),
  })

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="h-[400px] md:h-[600px] relative">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {artist?.mainImageUrl && (
          <Image
            src={artist?.mainImageUrl}
            alt="concert_image"
            sizes="250px, 250px"
            fill
            priority
            unoptimized
            onLoad={handleImageLoad}
            quality={100}
          />
        )}
      </div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="w-full grid grid-cols-3 h-12">
          {tabList.map(tab => (
            <Tab key={tab} className="text-primary bg-white mb-1 ">
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={
                    selected ? "border-b-4 border-blue1 w-full h-full " : ""
                  }
                >
                  {tab}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ArtistDetailFeed />
          </Tab.Panel>
          <Tab.Panel>
            <ArtistDetailConcert />
          </Tab.Panel>
          <Tab.Panel>
            <ArtistDetailYoutube />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ArtistDetailContatiner
