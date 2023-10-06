"use client"

import React, { useState } from "react"
import EducationCard from "./EducationCard"
import TestCard from "./TestCard"

const EducationContainer = () => {
  const [category, setCategory] = useState("ALL")

  const items = [1, 2, 3, 4]

  return (
    <div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {items.map((item, index) => (
          <TestCard key={item} index={index} />
        ))}
      </div>

      <h1 className="text-xl mt-10 ">레슨</h1>

      <EducationCard />
      <EducationCard />
      <EducationCard />
      <EducationCard />
    </div>
  )
}

export default EducationContainer
