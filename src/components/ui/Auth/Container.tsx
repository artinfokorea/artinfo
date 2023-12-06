"use client"

import { useState } from "react"
import { Tab } from "@headlessui/react"
import Login from "./Login"
import SignUp from "./SignUp"

const authList = ["로그인", "회원가입"]

export function Container() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleSelectedIndex = (index: number) => setSelectedIndex(index)

  return (
    <div className="mx-auto max-w-screen-md py-10 px-6">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="w-full grid grid-cols-2 h-12">
          {authList.map(auth => (
            <Tab
              key={auth}
              className="text-primary bg-white mb-1 ui-selected:border-none selected:none"
            >
              {({ selected }) => (
                <button
                  className={
                    selected ? "border-b-4 border-[#3948ab] w-full h-full" : ""
                  }
                >
                  {auth}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Login handleSelectedIndex={handleSelectedIndex} />
          </Tab.Panel>
          <Tab.Panel>
            <SignUp />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
}
