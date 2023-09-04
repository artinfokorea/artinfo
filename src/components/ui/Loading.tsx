"use client"

import { Spinner } from "@material-tailwind/react"

export default function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Spinner color="indigo" className="w-12 h-12" />
    </div>
  )
}
