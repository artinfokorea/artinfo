"use client"

import { forwardRef, ForwardedRef, useState, useEffect } from "react"
import Loading from "./ui/Loading/Loading"

type Props = {
  refetch: () => void
}

function PullToRefresh({ refetch }: Props, ref: ForwardedRef<HTMLDivElement>) {
  const [refreshing, setRefreshing] = useState(false)
  const [startY, setStartY] = useState(0)
  const [test, setTest] = useState("test")

  useEffect(() => {
    function handleTouchStart(event) {
      setStartY(event.touches[0].clientY)
    }

    function handleTouchMove(event) {
      const moveY = event.touches[0].clientY
      const pullDistance = moveY - startY

      if (pullDistance > 0) {
        event.preventDefault()

        if (pullDistance > 80) {
          ref.current.style.transform = "translate(0, 40px)"
          ref.current.style.transition = "0.3s"
          setRefreshing(true)
          setTest("refresh")
        }
      }
    }

    function handleTouchEnd() {
      if (refreshing) {
        refetch()
        // allPostsRefetch()
        // recentPostsRefetch()
        setTimeout(() => {
          setRefreshing(false)
          ref.current.style.transform = "translate(0,0)"
        }, 1000)
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    console.log("refreshing", refreshing)
    console.log("test", test)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [refreshing, startY, ref, test])

  return <div>{refreshing ? <Loading /> : ""}</div>
}

export default forwardRef<HTMLDivElement, Props>(PullToRefresh)
