import LocationTag from "@/components/common/LocationTag"
import { LESSON } from "@/types/types"
import Image from "next/image"
import React from "react"

interface Props {
  lesson: LESSON
}

const LessonCard = ({ lesson }: Props) => {
  console.log("majors", lesson.majors)

  return (
    <div className="card rounded-md cursor-pointer">
      <div className="overflow-hidden relative h-[200px]">
        <Image
          src={lesson.image_url ?? "/icon-192x192.png"}
          alt="job"
          sizes="(max-width: 1200px) 276px, 150px"
          fill
          priority
        />
      </div>

      <div className="px-2">
        <div className="flex-1 flex justify-center flex-col font-sm">
          <span className="font-semibold text-lg mt-2 mb-1 ">
            {lesson.name}
          </span>
          <div className="flex">
            {lesson.locations.map((location: string, index: number) => (
              <span
                className="my-2 text-sm text-primary font-semibold opacity-70"
                key={location}
              >
                {index === 0 ? location : <span> {`·${location}`}</span>}
              </span>
            ))}
          </div>
          <div className="my-2  font-semibold">
            {lesson.majors.map((major: string) => (
              <LocationTag key={major} tag={major} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonCard
