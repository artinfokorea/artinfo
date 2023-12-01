import { ARTIST } from "@/types/types"
import { Spinner } from "@material-tailwind/react"
import React, { useState } from "react"
import Image from "next/image"

interface IProps {
  artist: ARTIST
}

const ArtistCard = ({ artist }: IProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="card flex flex-col bg-white rounded-2xl cursor-pointer shadow-md">
      <div className="relative h-[90px] md:h-[180px] ">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        {artist?.mainImageUrl && (
          <Image
            src={`${artist.mainImageUrl}`}
            alt="artist_image"
            sizes="250px, 250px"
            fill
            priority
            unoptimized
            quality={100}
            onLoad={handleImageLoad}
            className="rounded-t-2xl"
          />
        )}
      </div>
      <div className="py-2 flex flex-col items-center break-keep">
        <span className="mt-1 text-sm font-semibold lg:text-base">
          {artist.koreanName}
        </span>
        <span className="text-xs mt-1 mb-1 opacity-75">
          {artist.englishName}
        </span>
      </div>
    </div>
  )
}

export default ArtistCard
