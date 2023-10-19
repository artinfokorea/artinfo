"use client"

import useToast from "@/hooks/useToast"
import { ChangeEvent, forwardRef, ForwardedRef } from "react"

type Props = {
  acceptType?: "IMAGE" | "VIDEO" | "DOC"
  uploadedFiles?: (files: File[]) => void
  multiple?: boolean
}

function FileUploader(
  { acceptType, uploadedFiles, multiple }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { errorToast } = useToast()

  const handleChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target as any
    if (!files) {
      return
    }

    const maxFile = 5

    if (files.length > maxFile) {
      errorToast("5장이상은 등록 할 수 없습니다.")
      e.preventDefault()
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
        multiple={multiple}
        accept="image/jpg,image/png,image/jpeg,image/gif"
        onChange={handleChangeFile}
      />
    </div>
  )
}

export default forwardRef<HTMLInputElement, Props>(FileUploader)
