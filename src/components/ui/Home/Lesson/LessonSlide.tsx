import { useQuery } from "@tanstack/react-query"
import React from "react"
import { fetchAdLessons } from "@/app/Api"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { Pagination } from "swiper/modules"
import { useRouter } from "next/navigation"

const LessonSlide = () => {
  const router = useRouter()
  const { data: lessons } = useQuery({
    queryKey: ["lessons"],
    suspense: true,
    queryFn: () => fetchAdLessons(),
  })

  return (
    <div className="overflow-hidden bg-white py-4 px-4 drop-shadow-md shawdow-md md:rounded-md">
      <h5 className="font-semibold mb-2 text-lg">레슨</h5>
      <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
        {lessons?.lessons.map(item => (
          <SwiperSlide
            key={item.id}
            style={{ width: 220, position: "relative" }}
            className="w-180px md:w-[220px] relative"
          >
            <div
              className="cursor-pointer relative h-[290px]"
              onClick={() => router.push(`/educations/${item.id}`)}
            >
              <Image
                src={item.image_url!}
                alt="lesson_profile_image"
                fill
                priority
                quality={100}
                sizes="(max-width: 680px) 100px 40px, (max-width: 1200px) 200px, 100px"
                className="max-w-full rounded-md shadow "
              />
            </div>
            <div className="absolute bottom-0 left-0 bg-white  w-full">
              <div className="m-2 px-2">
                <span>{item.name}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default LessonSlide
