import { ListBulletIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { useRouter } from "next/navigation"
import React from "react"

const ListButton = ({ list }: { list: string }) => {
  const router = useRouter()

  return (
    <IconButton
      className="bg-whitesmoke text-darkgrey py-2 rounded-full my-3 drop-shadow-md"
      onClick={() => {
        router.push(`/${list}`)
      }}
    >
      <ListBulletIcon className="w-8" />
    </IconButton>
  )
}

export default ListButton
