import React from "react"

const LocationTag = ({ tag }: { tag: string }) => {
  return (
    <span className="text-cornflowerblue text-sm bg-aliceblue py-1 px-2 mr-1 font-semibold whitespace-nowrap rounded-md">
      {tag}
    </span>
  )
}

export default LocationTag
