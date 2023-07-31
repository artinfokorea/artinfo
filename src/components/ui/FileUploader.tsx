"use client"

import { ChangeEvent, forwardRef, ForwardedRef } from "react"

type Props = {
  acceptType?: "IMAGE" | "VIDEO" | "DOC"
  uploadedFiles?: (files: File[]) => void
}

function FileUploader(
  { acceptType, uploadedFiles }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as any
    if (!files) {
      return
    }

    if (uploadedFiles) {
      uploadedFiles([...files])
    }
  }
  return (
    <div className="hidden">
      <input
        type="file"
        ref={ref}
        accept="image/jpg,impge/png,image/jpeg,image/gif"
        onChange={handleChangeFile}
      />
    </div>
  )
}

export default forwardRef<HTMLInputElement, Props>(FileUploader)
