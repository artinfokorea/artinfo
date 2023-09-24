"use client"

import { ArrowUpIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@/components/material"
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
      className=" text-darkgrey my-2 bg-whitesmoke rounded-full drop-shadow-md"
      onClick={handleScroll}
    >
      <ArrowUpIcon className="w-8" />
    </IconButton>
  )
}

export default ScrollUpButton
