import { ArrowUpIcon, ListBulletIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import React from "react"
import { useRouter } from "next/navigation"

interface IProps {
  handleScroll: () => void
}

const ScrollButton = ({ handleScroll }: IProps) => {
  const router = useRouter()

  return (
    <div className="fixed bottom-1/4 right-3 flex flex-col">
      <IconButton
        ripple={false}
        variant="text"
        size="md"
        className=" text-darkgrey my-2 bg-whitesmoke rounded-full"
        onClick={handleScroll}
      >
        <ArrowUpIcon className="w-8" />
      </IconButton>
      <IconButton
        className="bg-whitesmoke text-darkgrey py-2 rounded-full my-3"
        onClick={() => router.back()}
      >
        <ListBulletIcon className="w-8" />
      </IconButton>
    </div>
  )
}

export default ScrollButton
