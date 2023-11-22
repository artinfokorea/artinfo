import React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@/components/material"

interface Props {
  tag: string
  color?: string
  size?: string
  index: number
  deleteItem: (index: number) => void
}

const FilterTag = ({ tag, color, size, deleteItem, index }: Props) => {
  return (
    <div
      className={`${
        color === "blue"
          ? "text-cornflowerblue bg-aliceblue"
          : "text-salomon bg-seashell"
      } text-sm md:text-base   pl-1 pr-[2px] mr-1 font-semibold whitespace-nowrap rounded-xl`}
    >
      <span>{tag}</span>
      <IconButton
        ripple={false}
        variant="text"
        size="sm"
        className=" text-black opacity-50 mb-[2px] md:mb-1"
        onClick={() => deleteItem(index)}
      >
        <XMarkIcon className="w-5" />
      </IconButton>
    </div>
  )
}

export default FilterTag
