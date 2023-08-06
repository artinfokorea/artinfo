"use client"

import React, { useEffect, useState } from "react"
// import { Editor as DraftEditor } from "react-draft-wysiwyg"
import { ContentState, convertToRaw, EditorState } from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useIsMounted } from "@toss/react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import dynamic from "next/dynamic"

const DraftEditor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false },
)

interface IEditorProps {
  htmlStr: string
  setHtmlStr: React.Dispatch<React.SetStateAction<string>>
}

function Editor({ htmlStr, setHtmlStr }: IEditorProps) {
  const isMounted = useIsMounted()
  const editorStyle = {
    height: "700px",
  }

  const toolbarStyle = {}
  // const toolbar = {}
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  useEffect(() => {
    if (isMounted) {
      const blocksFromHtml = htmlToDraft(htmlStr)
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml
        const contentState = ContentState.createFromBlockArray(
          contentBlocks,
          entityMap,
        )
        const editorState = EditorState.createWithContent(contentState)
        setEditorState(editorState)
      }
    }
  }, [])

  const onEditorStateChange = (editorState: EditorState) => {
    setEditorState(editorState)
    setHtmlStr(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  }

  return (
    <DraftEditor
      localization={{
        locale: "ko",
      }}
      wrapperClassName="wrapper-class"
      editorClassName="editor-class"
      editorStyle={editorStyle}
      toolbarStyle={toolbarStyle}
      onEditorStateChange={onEditorStateChange}
      editorState={editorState}
    />
  )
}

export default Editor
