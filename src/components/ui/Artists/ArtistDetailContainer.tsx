"use client"

import React, { useState } from "react"
import { Tab } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { getArtist } from "@/apis/artist"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Spinner } from "@material-tailwind/react"
import { ResizableBox } from "react-resizable"
import Draggable, { DraggableCore } from "react-draggable"
import ArtistDetailFeed from "./ArtistDetailFeed"
import ArtistDetailConcert from "./ArtistDetailConcert"
import ArtistDetailYoutube from "./ArtistDetailYoutube"

const tabList = ["피드", "공연", "영상"]

const ArtistDetailContainer = () => {
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
  const handleDrag = (e: any, ui: any) => {
    console.log("e", e)
    console.log("ui", ui)
  }

  return (
    <div className="max-w-screen-lg mx-auto">
      {/* <Draggable bounds="body" onDrag={handleDrag}> */}
      <div className="h-[300px] md:h-[500px] relative">
        {/* <ResizableBox
          width={200}
          height={200}
          on> */}
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {artist?.mainImageUrl && (
          <Image
            src={artist?.mainImageUrl}
            alt="artist_image"
            sizes="250px, 250px"
            fill
            priority
            unoptimized
            onLoad={handleImageLoad}
            quality={100}
          />
        )}
        {/* </ResizableBox> */}
      </div>
      {/* </Draggable> */}
      <Tab.Group defaultIndex={0}>
        <Tab.List className="w-full grid grid-cols-3 h-12">
          {tabList.map(tab => (
            <Tab
              key={tab}
              className="text-primary bg-white mb-1 ui-selected:border-none selected:none"
            >
              {({ selected }) => (
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

export default ArtistDetailContainer
