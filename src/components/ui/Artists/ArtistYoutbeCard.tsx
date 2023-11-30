import { YOUTUBE } from "@/types/types"
import ReactPlayer from "react-player"
import React, { useEffect } from "react"
import { useIsMounted } from "@toss/react"
import useFilters from "@/hooks/useFilters"

interface Props {
  youtube: YOUTUBE
}

const ArtistYoutbeCard = ({ youtube }: Props) => {
  const isMounted = useIsMounted()
  const filters = useFilters()

  useEffect(() => {
    if (!isMounted) {
      return
    }
  }, [isMounted])

  return (
    <div className="flex mb-2">
      {isMounted && (
        <div className="min-w-32 h-24 md:h-[150px] md:min-w-[150px]">
          <ReactPlayer
            url={youtube.linkUrl}
            width="100%"
            height="100%"
            muted
            playing={false}
          />
        </div>
      )}
      <div className="flex flex-col justify-center ml-2 md:ml-8">
        <span className=" text-ellipsis line-clamp-1 ">{youtube.title}</span>
        <div>
          <span>{youtube.artistName}</span>
          <span>{filters.YYYYMMDD(youtube.publishedAt)}</span>
        </div>
      </div>
    </div>
  )
}

export default ArtistYoutbeCard
