"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import { Pagination } from "swiper/modules"
import { AdvertisementPoster } from "@/app/Api"
import { ADS } from "@/types/types"

interface IProps {
  posters?: {
    id: number
    image_url: string | null
    redirect_url: string | null
  }[]
}

export default function AdUi({ posters }: IProps) {
  const handleOpenNewTab = (url: string | null): void => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
      {/* <Swiper spaceBetween={10} slidesPerView={3} modules={[Pagination]}> */}
      {posters?.map(item => (
        // <SwiperSlide key={item.id} style={{ width: "270px" }}>
        <SwiperSlide key={item.id} style={{ width: 180 }}>
          <div
            style={{ height: 260 }}
            className="cursor-pointer relative h-[150px]"
            onClick={() => handleOpenNewTab(item.redirect_url)}
          >
            <Image
              src={item.image_url!}
              alt="concert-image"
              fill
              priority
              quality={100}
              sizes="(max-width: 680px) 100px 40px, (max-width: 1200px) 200px, 100px"
              className="max-w-full rounded-md shadow hover:shadow-lg"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
