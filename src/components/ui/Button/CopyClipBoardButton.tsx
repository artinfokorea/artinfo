"use client"

import { ShareIcon } from "@heroicons/react/24/outline"
import React from "react"
import { clipboard } from "@toss/utils"
import useToast from "@/hooks/useToast"
import { useParams, usePathname } from "next/navigation"

const CopyClipBoardButton = () => {
  const { successToast } = useToast()
  const pathname = usePathname()

  const handleCopyClipboard = async () => {
    const shareUrl = `https://${window.location.host}${pathname}`
    const isSuccess = await clipboard.writeText(shareUrl)
    if (isSuccess) {
      successToast("공유할 공연 URL을 클립보드에 복사했어요!")
    }
  }

  return (
    <button onClick={handleCopyClipboard}>
      <ShareIcon className="w-5" />
    </button>
  )
}

export default CopyClipBoardButton
