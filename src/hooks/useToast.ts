"use client"

import { toast } from "react-hot-toast"

const useToast = () => {
  const successToast = (text: string) =>
    toast.success(text, {
      duration: 4000,
      position: "bottom-center",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#449F3C",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    })

  const errorToast = (text: string) =>
    toast.error(text, {
      duration: 4000,
      position: "bottom-center",

      // Change colors of success/error/loading icon
      iconTheme: {
        primary: "#EA2A2A",
        secondary: "#fff",
      },

      // Aria
      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    })
  return { successToast, errorToast }
}

export default useToast
