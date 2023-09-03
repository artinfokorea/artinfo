import { ArrowUpIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import React from "react"

interface IProps {
  handleScroll: () => void
}

const ScrollUpButton = ({ handleScroll }: IProps) => {
  return (
    <IconButton
      ripple={false}
      variant="text"
      size="md"
      className=" text-darkgrey my-2 bg-whitesmoke rounded-full"
      onClick={handleScroll}
    >
      <ArrowUpIcon className="w-8" />
    </IconButton>
  )
}

export default ScrollUpButton
