import React from "react"
import ScrollUpButton from "./ScrollUpButton"
import ListButton from "./ListButton"

interface IProps {
  handleScroll: () => void
}

const ScrollButtonWrap = ({ handleScroll }: IProps) => {
  return (
    <div className="fixed bottom-1/4 right-3 flex flex-col">
      <ScrollUpButton handleScroll={handleScroll} />
      <ListButton />
    </div>
  )
}

export default ScrollButtonWrap
