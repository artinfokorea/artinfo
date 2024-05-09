"use client"

import { ListBulletIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { isMobileWeb } from "@toss/utils"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

const MobileListButton = ({ goToBack }: { goToBack?: () => void }) => {
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = isMobileWeb()
  const listPage = pathname.slice(0, pathname.lastIndexOf("/"))

  const goToList = () => {
    if (goToBack) {
      goToBack()
    } else {
      router.push(listPage)
    }
  }

  return (
    <>
      {isMobile && (
        <IconButton
          className="bg-whitesmoke text-darkgrey py-2 rounded-full my-3 drop-shadow-md"
          onClick={goToList}
        >
          <ListBulletIcon className="w-8" />
        </IconButton>
      )}
    </>
  )
}

export default MobileListButton
