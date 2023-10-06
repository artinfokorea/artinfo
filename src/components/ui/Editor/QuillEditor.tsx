"use client"

import React, { useMemo, useCallback } from "react"
import useAuth from "@/hooks/useAuth"
import useSupabase from "@/hooks/useSupabase"
import "react-quill/dist/quill.snow.css"
import ReactQuill from "react-quill"
import "./editor.css"

const QuillEditor = ({ quillRef, htmlContent, setHtmlContent }: any) => {
  const supabase = useSupabase()
  const auth = useAuth()

  const imageHandler = useCallback(() => {
    // if (typeof window === "undefined") {
    //   return null
    // }
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.setAttribute("name", "image")
    input.click()

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return
      const file = input.files[0]

      const fileName = new Date().getTime().toString()

      const result = await uploadFile(
        `contents/${auth.user?.id}/${fileName}.png`,
        file,
      )

      const url = `https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/${
        result.data!.path
      }`
      const quill = quillRef.current.getEditor()

      const range = quill.getSelection()?.index

      if (typeof range !== "number") return

      quill.setSelection(range, 1)

      console.log("url", url)

      quill.clipboard.dangerouslyPasteHTML(
        range,
        `<img src=${url} alt="image" />`,
      )
    }
  }, [quillRef])

  const modules = useMemo(
    () => ({
      toolbar: {
        // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          ["image", "video"],
        ],
        handlers: {
          // 위에서 만든 이미지 핸들러 사용하도록 설정
          image: imageHandler,
        },
      },
    }),
    [imageHandler],
  )

  const uploadFile = async (path: string, file: File) => {
    return supabase.storage.from("artinfo").upload(path, file, {
      cacheControl: "36000",
      upsert: true,
    })
  }

  return (
    <div className="my-3">
      <ReactQuill
        ref={quillRef}
        value={htmlContent}
        onChange={setHtmlContent}
        modules={modules}
        theme="snow"
      />
    </div>
  )
}

export default QuillEditor
