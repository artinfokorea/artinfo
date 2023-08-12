"use client"

import { isMobileWeb } from "@toss/utils"
import React, { useEffect, useState } from "react"
import HomeScreenModal from "./HomeScreenModal"

const HomeScreenContainer = () => {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = isMobileWeb()

  const handleOpen = () => setIsOpen(!isOpen)

  const modalIgnoreForAWeek = () => {
    const currentDate = new Date()
    const nextWeekDate = new Date()
    nextWeekDate.setDate(currentDate.getDate() + 7)

    const data = {
      expireDate: nextWeekDate.toISOString(),
    }

    localStorage.setItem("modalInfo", JSON.stringify(data))

    setIsOpen(false)
  }

  useEffect(() => {
    const modalInfo = localStorage.getItem("modalInfo")
    const hideForWeek = modalInfo && JSON.parse(modalInfo)

    if (isMobile) {
      if (hideForWeek) {
        const expireDate = new Date(hideForWeek.expireDate)
        const currentDate = new Date()
        if (currentDate > expireDate) {
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      } else {
        setIsOpen(true)
      }
    }
  }, [])

  return (
    <div>
      {isOpen && (
        <HomeScreenModal
          handleOpen={handleOpen}
          modalIgnoreForAWeek={modalIgnoreForAWeek}
        />
      )}
    </div>
  )
}

export default HomeScreenContainer
