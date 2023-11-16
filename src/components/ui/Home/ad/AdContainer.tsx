"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAds } from "@/app/Api"

import AdUi from "./AdUi"

export default function AdContainer() {
  const { data: ads } = useQuery({
    queryKey: ["ads"],
    suspense: true,
    queryFn: () => fetchAds(),
  })

  return <div>{ads?.data && <AdUi posters={ads.data} />}</div>
}
