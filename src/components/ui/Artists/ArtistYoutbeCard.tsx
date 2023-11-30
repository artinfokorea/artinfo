import { YOUTUBE } from "@/types/types"
import ReactPlayer from "react-player"
import React, { useEffect } from "react"
import { useIsMounted } from "@toss/react"
import useFilters from "@/hooks/useFilters"
import Link from "next/link"
import { isMobileWeb } from "@toss/utils"

interface Props {
  youtube: YOUTUBE
}

const ArtistYoutbeCard = ({ youtube }: Props) => {
  const isMounted = useIsMounted()
  const filters = useFilters()
  const isMobile = isMobileWeb()

  useEffect(() => {
    if (!isMounted) {
      return
    }
  }, [isMounted])

  return (
    <Link href={youtube.linkUrl} target="_blank">
      <div className="flex mb-4 h-32 md:h-60">
        {isMounted && (
          <div className="w-36 md:w-80">
            <ReactPlayer
              url={youtube.linkUrl}
              width="100%"
              height="100%"
              muted
            />
          </div>
        )}
        <div className="flex flex-col justify-center ml-4 md:ml-8 text-primary">
          <span className=" text-ellipsis line-clamp-1 font-bold ">
            {isMobile ? youtube.title.substring(0, 20) : youtube.title}
          </span>
          <div className="flex opacity-75 font-bold mt-1">
            <span className="text-sm">{youtube.artistName}</span>
            <span className="text-sm ml-4 ">
              {filters.YYYYMMDD(youtube.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArtistYoutbeCard
