"use client"

import { createContext, useState } from "react"
import { CSSTransition } from "react-transition-group"
// import styles from "./Snackbar.css"
import "./Snackbar.css"

// Snackbar default values
export const defaultPosition = "bottom-center"
export const defaultDuration = 5000
export const defaultInterval = 250
export const positions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

type SnackPositionType =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

// Context used by the hook useSnackbar() and HoC withSnackbar()
type SnackbarContextType = {
  openSnackbar: (payload: {
    text: string
    duration: number
    position: SnackPositionType
    style?: any
    closeStyle?: any
  }) => void
  closeSnackbar: () => void
}
export const SnackbarContext = createContext<any>(null)

interface IProps {
  children: React.ReactNode
}

export default function Snackbar({ children }: IProps) {
  // Current open state
  const [open, setOpen] = useState(false)
  // Current timeout ID
  const [timeoutId, setTimeoutId] = useState<any>()
  // Snackbar's text
  const [text, setText] = useState("")
  // Snackbar's duration
  const [duration, setDuration] = useState(defaultDuration)
  // Snackbar's position
  const [position, setPosition] = useState(defaultPosition)
  // Custom styles for the snackbar itself
  const [customStyles, setCustomStyles] = useState({})
  // Custom styles for the close button
  const [closeCustomStyles, setCloseCustomStyles] = useState({})

  const triggerSnackbar = ({
    text,
    duration,
    position,
    style,
    closeStyle,
  }: {
    text: string
    duration: number
    position: string
    style: any
    closeStyle: any
  }) => {
    setText(text)
    setDuration(duration)
    setPosition(position)
    setCustomStyles(style)
    setCloseCustomStyles(closeStyle)
    setOpen(true)
  }

  // Manages all the snackbar's opening process
  const openSnackbar = ({
    text,
    duration,
    position,
    style,
    closeStyle,
  }: {
    text: string
    duration: number
    position: SnackPositionType
    style?: any
    closeStyle?: any
  }) => {
    // Closes the snackbar if it is already open
    if (open === true) {
      setOpen(false)
      setTimeout(() => {
        triggerSnackbar({ text, duration, position, style, closeStyle })
      }, defaultInterval)
    } else {
      triggerSnackbar({ text, duration, position, style, closeStyle })
    }
  }

  // Closes the snackbar just by setting the "open" state to false
  const closeSnackbar = () => {
    setOpen(false)
  }

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SnackbarContext.Provider value={{ openSnackbar, closeSnackbar }}>
      {children}

      <CSSTransition
        in={open}
        timeout={150}
        mountOnEnter
        unmountOnExit
        // Sets timeout to close the snackbar
        onEnter={() => {
          clearTimeout(timeoutId)
          setTimeoutId(setTimeout(() => setOpen(false), duration))
        }}
        // Sets custom classNames based on "position"
        className={`snackbar-wrapper snackbar-wrapper-${[position]}`}
        classNames={{
          enter: `snackbar-enter snackbar-enter-${position}`,
          enterActive: `snackbar-enter-active snackbar-enter-active-${position}`,
          exitActive: `snackbar-exit-active snackbar-exit-active-${position}`,
        }}
      >
        {/* This div will be rendered with CSSTransition classNames */}
        <div>
          <div className="snackbar" style={customStyles}>
            {/* Snackbar's text */}
            <div className="snackbar__text">{text}</div>

            {/* Snackbar's close button */}
            <button
              onClick={closeSnackbar}
              className="snackbar__close"
              style={closeCustomStyles}
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      </CSSTransition>
    </SnackbarContext.Provider>
  )
}

// CloseIcon SVG is styled with font properties
function CloseIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 12 12">
      <path
        fill="currentColor"
        d="M11.73 1.58L7.31 6l4.42 4.42-1.06 1.06-4.42-4.42-4.42 4.42-1.06-1.06L5.19 6 .77 1.58 1.83.52l4.42 4.42L10.67.52z"
        fillRule="evenodd"
      />
    </svg>
  )
}
