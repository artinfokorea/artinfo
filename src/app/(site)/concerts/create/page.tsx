import React from "react"
import { PageType } from "@/interface/common"
import ConcertForm from "../../../../components/ui/Concert/ConcertForm"

const page = () => {
  return (
    <div>
      <ConcertForm type={PageType.create} />
    </div>
  )
}

export default page
