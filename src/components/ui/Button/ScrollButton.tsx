import { ArrowUpIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { Link } from "react-scroll"
import React from "react"

const ScrollButton = () => {
  return (
    <Link to="top" smooth>
      <IconButton
        ripple={false}
        variant="text"
        size="md"
        className=" text-darkgrey my-2 bg-whitesmoke rounded-full"
      >
        <ArrowUpIcon className="w-8" />
      </IconButton>
    </Link>
  )
}

export default ScrollButton
