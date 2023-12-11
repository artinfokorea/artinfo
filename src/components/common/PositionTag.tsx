import React from "react"

interface IProps {
  tag: string
  margin?: number
}

const PositionTag = ({ tag, margin }: IProps) => {
  return (
    <li
      className={`bg-aliceblue py-1 px-2 rounded-md ${
        margin ? `mr-${margin}` : ""
      }`}
    >
      <span className="text-cornflowerblue font-semibold">{tag}</span>
    </li>
  )
}

export default PositionTag
