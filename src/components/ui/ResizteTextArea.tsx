"use client"

import TextareaAutosize from "react-textarea-autosize"

type IProps = {
  value: string
  minRows?: number
  maxRows?: number
  placeholder?: string
  maxLength?: number
  className?: string
  onChange?: (value: string) => void
}
export function ResizteTextArea({
  value,
  placeholder = "type your text...",
  minRows = 1,
  maxRows,
  maxLength,
  className,
  onChange,
}: IProps) {
  const defaultClassName =
    "border-0 resize-none w-full bg-transparent p-0 outline-none focus:ring-0"
  const mergeClassName = `${defaultClassName} ${className}`
  return (
    <TextareaAutosize
      value={value}
      minRows={minRows}
      maxRows={maxRows}
      maxLength={maxLength}
      autoFocus
      className={mergeClassName}
      placeholder={placeholder}
      onChange={ev => onChange && onChange(ev.target.value)}
    />
  )
}
