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
      <div className="relative h-[220px] lg:h-[300px]">
        {isLoading && (
          <div className="flex items-center justify-center absolute inset-0">
            <Spinner />
          </div>
        )}
        <Image
          src={lesson.imageUrl ?? "/icon-192x192.png"}
          alt="lesson_profile"
          sizes="250px, 250px"
          fill
          quality={100}
          priority
          className="rounded-md"
          onLoad={() => setisLoading(false)}
        />
      </div>
      <div>
        <div className="flex-1 flex justify-center flex-col font-sm">
          <span className="font-semibold text-lg mt-2 mb-1 ">
            {lesson.name}
          </span>

          <div className="flex flex-col">
            {lesson.locations?.map((location: string) => (
              <span
                key={location}
                className="text-sm text-primary font-semibold opacity-70 block break-keep"
              >
                {location}
              </span>
            ))}
          </div>
          <div className="my-2 font-semibold whitespace-pre-line">
            {lesson.majors?.map((major: string) => (
              <LocationTag key={major} tag={major} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LessonCard
