import { ListBulletIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { useRouter } from "next/navigation"
import React from "react"

const ListButton = ({
  list,
  goToBack,
}: {
  list: string
  goToBack?: () => void
}) => {
  const router = useRouter()

  const goToList = () => {
    if (goToBack) {
      goToBack()
    } else {
      router.push(`/${list}`)
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
