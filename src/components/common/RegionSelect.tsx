"use client"

import { RegionData } from "@/lib/regions"
import { Listbox } from "@headlessui/react"
import React, { useState } from "react"

const RegionSelect = () => {
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  return (
    <div className="flex">
      <Listbox value={selectedCity} onChange={value => setSelectedCity(value)}>
        <Listbox.Button className="w-full border bg-white px-2 items-center py-1 rounded-lg flex justify-between ">
          {Object.keys(RegionData).filter(item => item === selectedCity)}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 ml-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </Listbox.Button>
        <Listbox.Options>
          {Object.keys(RegionData).map(item => (
            <Listbox.Option
              key={item}
              value={item}
              className=" border bg-white py-1 px-2 w-32 rounded-lg"
            >
              {item}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      {selectedCity && (
        <Listbox
          value={selectedDistrict}
          onChange={value => setSelectedDistrict(value)}
        >
          <Listbox.Button className="w-full border bg-white px-2 items-center py-1 rounded-lg flex justify-between">
            {/* {RegionData[selectedCity][0]} */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </Listbox.Button>
          <Listbox.Options>
            {RegionData[selectedCity].map(item => (
              <Listbox.Option
                key={item}
                value={item}
                className=" border bg-white py-1 px-2 w-32 rounded-lg"
              >
                {item}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      )}
    </div>
  )
}

export default RegionSelect
