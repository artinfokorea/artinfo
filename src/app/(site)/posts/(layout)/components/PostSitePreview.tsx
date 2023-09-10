"use client"

import { useState } from "react"

interface IProps {
  meta: {
    fullUrl: string
    url: string
    host: string
    title: string
    description?: string
    image?: string
  }
}

export default function PostSitePreview({ meta }: IProps) {
  const [imageError, setImageError] = useState(false)

  const handleOpenPreview = () => {
    const siteUrl = meta.fullUrl
    window.open(siteUrl, "_blank")
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div
      className="overflow-hidden rounded-lg border border-gray-200 drop-shadow-md cursor-pointer"
      onClick={handleOpenPreview}
    >
      <div
        className="relative overflow-hidden flex items-center justify-center"
        style={{ maxHeight: 280 }}
      >
        {imageError ? (
          <img
            src="/icon-384x384.png"
            alt="fallback image"
            className="object-cover object-center"
          />
        ) : (
          <img
            src={meta.image}
            alt="preview img"
            className="object-cover object-center"
          />
        )}
      </div>
      <div className="p-4 bg-gray-200">
        <div>{meta.host}</div>
        <div className="font-bold text-md">{meta.title}</div>
        <div className="text-sm">{meta.description}</div>
      </div>
    </div>
  )
}
