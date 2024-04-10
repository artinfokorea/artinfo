import { fetchBanners } from "@/app/Api"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import React from "react"
import { Carousel } from "@/components/material"
import Link from "next/link"
import { AspectRatio } from "../aspect-ratio"

const BannerContainer = () => {
  const { data: banners } = useQuery({
    queryKey: ["banners"],
    suspense: true,
    queryFn: () => fetchBanners(),
  })

  return (
    <div className="py-2 px-4 md:p-0 mb-2">
      <Carousel autoplay loop>
        {banners?.map(banner => (
          <Link
            key={banner.id}
            href={banner.redirect_url as string}
            target="_blank"
          >
            <div className="cursor-pointer relative ">
              <AspectRatio ratio={4 / 1}>
                <Image
                  src={banner.image_url}
                  alt="banner_image"
                  fill
                  quality={100}
                  unoptimized
                  sizes="(max-width: 680px) 500px 140px, (max-width: 1200px) 1200px, 250px"
                  className="rounded-xl shadow"
                />
              </AspectRatio>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  )
}

export default BannerContainer
