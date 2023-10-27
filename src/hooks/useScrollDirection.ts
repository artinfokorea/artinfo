import React, { useEffect } from "react"
import { useRecoilState } from "recoil"
import { scrollDirState } from "@/atoms/scrollDir"

const useScrollDirection = () => {
  const [scrollDir, setScrollDir] = useRecoilState(scrollDirState)

  useEffect(() => {
    const threshold = 0
    let lastScrollY = window.pageYOffset
    let ticking = false

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false
        return
      }
      setScrollDir(scrollY > lastScrollY ? "scrollDown" : "scrollUp")
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir)
        ticking = true
      }
    }

    window.addEventListener("scroll", onScroll)

    return () => window.removeEventListener("scroll", onScroll)
  }, [scrollDir])
}

export default useScrollDirection
