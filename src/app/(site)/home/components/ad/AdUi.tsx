"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"

import { Pagination } from "swiper/modules"

interface IProps {
  posters: {
    id: number
    image_url: string | null
    redirect_url: string | null
  }[]
}

export default function AdUi({ posters }: IProps) {
  // const items: string[] = [
  //   "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/7.jpg",
  //   "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/PS23071000084.jpg",
  //   "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/busan_choral.jpg",
  //   "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/a1030e421f115df2ef8191761afd5b5e.png",
  //   "https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/a1030e421f115df2ef8191761afd5b5e.png",
  // ]

  const handleOpenNewTab = (url: string | null): void => {
    if (url) {
      window.open(url, "_blank")
    }
  }

  return (
    <Swiper spaceBetween={10} slidesPerView="auto" modules={[Pagination]}>
      {/* <Swiper spaceBetween={10} slidesPerView={3} modules={[Pagination]}> */}
      {posters.map((item, idx) => (
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
              sizes="(max-width: 680px) 100px 40px, (max-width: 1200px) 200px, 100px"
              className="max-w-full rounded-md shadow hover:shadow-lg"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
