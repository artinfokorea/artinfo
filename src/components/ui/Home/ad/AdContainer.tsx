"use client"

import AdUi from "./AdUi"

interface Props {
  ads?: {
    id: number
    image_url: string | null
    redirect_url: string | null
  }[]
}

export default function AdContainer({ ads }: Props) {
  return (
    <div className="overflow-hidden bg-white py-4 px-4 drop-shadow-md shawdow-md md:rounded-md">
      <h5 className="font-semibold mb-2 text-lg">콘서트</h5>
      <div className="overflow-x-auto">
        <AdUi posters={ads} />
      </div>
    </div>
  )
}
