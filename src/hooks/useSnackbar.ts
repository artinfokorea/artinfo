import {
  SnackbarContext,
  defaultDuration,
  defaultPosition,
} from "@/components/ui/Snackbar"
import { useContext } from "react"

// Custom hook to trigger the snackbar on function components
export default function useSnackbar({
  position = defaultPosition,
  style = {},
  closeStyle = {},
} = {}) {
  const { openSnackbar, closeSnackbar } = useContext(SnackbarContext)

  function open(text = "", duration = defaultDuration) {
    openSnackbar({ text, duration, position, style, closeStyle })
  }

  // Returns methods in hooks array way
  return [open, closeSnackbar]
}
