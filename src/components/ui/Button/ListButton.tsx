import { ListBulletIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

const ListButton = ({ goToBack }: { goToBack?: () => void }) => {
  const router = useRouter()
  const pathname = usePathname()
  const listPage = pathname.slice(0, pathname.lastIndexOf("/"))

  const goToList = () => {
    if (goToBack) {
      goToBack()
    } else {
      router.push(listPage)
    }
  }

  return (
    <IconButton
      className="bg-whitesmoke text-darkgrey py-2 rounded-full my-3 drop-shadow-md"
      onClick={goToList}
    >
      <ListBulletIcon className="w-8" />
    </IconButton>
  )
}

export default ListButton
