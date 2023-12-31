"use client"

import { isMobileWeb } from "@toss/utils"
import React, { useEffect, useState } from "react"
import { Cookies } from "react-cookie"
import HomeScreenModal from "./HomeScreenModal"

const HomeScreenContainer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = isMobileWeb()
  const [isIPhone, setIsIPhone] = useState(false)
  const cookies = new Cookies()
  const isModalExpires = cookies.get("modal_expires")
  const handleOpen = () => setIsOpen(!isOpen)

  const modalIgnoreForAWeek = () => {
    const currentDate = new Date()
    const nextWeekDate = new Date()
    nextWeekDate.setDate(currentDate.getDate() + 7)

    cookies.set("modal_expires", nextWeekDate, {
      path: "/",
      expires: nextWeekDate,
    })

    setIsOpen(false)
  }

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf("iphone") > -1) {
      setIsIPhone(true)
    }

    if (isMobile && !isModalExpires) {
      setIsOpen(true)
    }
  }, [])

  return (
    <div>
      {isOpen && (
        <HomeScreenModal
          isIPhone={isIPhone}
          handleOpen={handleOpen}
          modalIgnoreForAWeek={modalIgnoreForAWeek}
        />
      )}
    </div>
  )
}

export default HomeScreenContainer
