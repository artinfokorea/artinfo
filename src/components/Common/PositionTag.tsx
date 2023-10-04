import React from "react"

interface IProps {
  tag: string
}

const PositionTag = ({ tag }: IProps) => {
  return (
    <div className="bg-aliceblue py-1 px-2 rounded-md">
      <span className="text-cornflowerblue font-semibold">{tag}</span>
    </div>
  )
}

export default PositionTag
