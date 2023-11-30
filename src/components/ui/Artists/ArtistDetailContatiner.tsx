"use client"

import React, { Fragment } from "react"
import { Tab } from "@headlessui/react"
import ArtistDetailFeed from "./ArtistDetailFeed"
import ArtistDetailConcert from "./ArtistDetailConcert"

const tabList = ["피드", "공연", "영상"]

const ArtistDetailContatiner = () => {
  return (
    <div className="sm:container mx-auto">
      <div className="bg-lightgrey h-[400px]">hi</div>
      <Tab.Group defaultIndex={0}>
        <Tab.List className="w-full grid grid-cols-3 h-12">
          {tabList.map(tab => (
            <Tab key={tab} className="text-primary">
              {({ selected }) => (
                /* Use the `selected` state to conditionally style the selected tab. */
                <button
                  className={
                    selected
                      ? "border-b-2 border-blue1 w-full h-full "
                      : "bg-white text-black"
                  }
                >
                  {tab}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <ArtistDetailFeed />
          </Tab.Panel>
          <Tab.Panel>
            <ArtistDetailConcert />
          </Tab.Panel>
          <Tab.Panel>Tab 3 content</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}

export default ArtistDetailContatiner
