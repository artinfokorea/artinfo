import React, { useState } from "react"

interface Props {
  handleRegionModal: () => void
  handleMajorModal: () => void
}

const EducationSearchForm = ({
  handleRegionModal,
  handleMajorModal,
}: Props) => {
  return (
    <div className="ml-4 flex">
      <button
        onClick={handleRegionModal}
        className="flex items-center mr-2 rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400
          "
      >
        <span>지역 검색</span>
      </button>
      <button
        onClick={handleMajorModal}
        className="flex items-center rounded-2xl h-8 py-2 px-3 text-sm bg-indigo-500 text-white  hover:bg-indigo-400
          "
      >
        <span>전공 검색</span>
      </button>
    </div>
  )
}

export default EducationSearchForm
