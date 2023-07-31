"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAds } from "@/app/Api"
import AdUi from "./AdUi"

export default function AdContainer() {
  const { data: ads } = useQuery({
    queryKey: ["ads"],
    suspense: false,
    queryFn: () => fetchAds(),
  })

  if (!ads?.data) {
    return <div>loading...</div>
  }

  return <AdUi posters={ads!.data} />
}
