import { fetchBanners } from "@/app/Api"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import { useRouter } from "next/navigation"
import "swiper/css"
import React from "react"

const BannerContainer = () => {
  const router = useRouter()
  const { data: banners } = useQuery({
    queryKey: ["banners"],
    suspense: true,
    queryFn: () => fetchBanners(),
  })

  return (
    <div className="py-2 px-4 md:p-0 mb-2">
      <Swiper autoplay pagination={{ clickable: true }} modules={[Pagination]}>
        {banners?.map(banner => (
          <SwiperSlide key={banner.id} style={{ width: "100%" }}>
            <div
              className="cursor-pointer relative h-[140px] md:h-[250px]"
              onClick={() => router.push("/inquiry")}
            >
              <Image
                src={banner.image_url!}
                alt="banner_image"
                fill
                priority
                unoptimized
                quality={100}
                sizes="(max-width: 680px) 500px 140px, (max-width: 1200px) 1200px, 250px"
                className="rounded-xl shadow"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerContainer
