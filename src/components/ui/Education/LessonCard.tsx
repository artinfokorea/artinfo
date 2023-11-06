import LocationTag from "@/components/common/LocationTag"
import { LESSON } from "@/types/types"
import Image from "next/image"
import React, { useState } from "react"
import { Spinner } from "@material-tailwind/react"

interface Props {
  lesson: LESSON
}

const LessonCard = ({ lesson }: Props) => {
  const [isLoading, setisLoading] = useState(true)

  return (
    <div className="card rounded-md cursor-pointer ">
      {isLoading && (
        <div className="flex items-center justify-center absolute inset-0">
          <Spinner />
        </div>
      )}
      <div className="overflow-hidden relative h-[240px] rounded-sm">
        <Image
          src={lesson.image_url ?? "/icon-192x192.png"}
          alt="job"
          sizes="(max-width: 1200px) 276px, 150px"
          fill
          quality={100}
          priority
          onLoad={() => setisLoading(false)}
        />
      </div>

      <div>
        <div className="flex-1 flex justify-center flex-col font-sm">
          <span className="font-semibold text-lg mt-2 mb-1 ">
            {lesson.name}
          </span>
          <div className="flex flex-col">
            {lesson.locations.map((location: string) => (
              <span
                key={location}
                className="text-sm text-primary font-semibold opacity-70 block break-keep"
              >
                {location}
              </span>
            ))}
          </div>
          <div className="my-2 font-semibold whitespace-pre-line">
            {lesson.subjects.map((subject: string) => (
              <LocationTag key={subject} tag={subject} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonCard
