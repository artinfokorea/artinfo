import React from "react"
import ScrollUpButton from "./ScrollUpButton"
import ListButton from "./ListButton"

interface IProps {
  handleScroll: () => void
  goToBack?: () => void
}

const ScrollButtonWrap = ({ handleScroll, goToBack }: IProps) => {
  return (
    <div className="fixed bottom-32 right-3 flex flex-col">
      <ScrollUpButton handleScroll={handleScroll} />
      <ListButton goToBack={goToBack} />
    </div>
  )
}

export default ScrollButtonWrap
