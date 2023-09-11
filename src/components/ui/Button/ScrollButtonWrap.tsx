import React from "react"
import ScrollUpButton from "./ScrollUpButton"
import ListButton from "./ListButton"

interface IProps {
  handleScroll: () => void
  list: string
}

const ScrollButtonWrap = ({ handleScroll, list }: IProps) => {
  return (
    <div className="fixed bottom-32 right-3 flex flex-col">
      <ScrollUpButton handleScroll={handleScroll} />
      <ListButton list={list} />
    </div>
  )
}

export default ScrollButtonWrap
