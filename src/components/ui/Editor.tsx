"use client"

import React, { useEffect, useState } from "react"
import {
  AtomicBlockUtils,
  ContentState,
  convertToRaw,
  EditorState,
} from "draft-js"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import { useIsMounted } from "@toss/react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import dynamic from "next/dynamic"
import useSupabase from "@/hooks/useSupabase"
import useAuth from "@/hooks/useAuth"

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
  const maxFileSize = 50
  const auth = useAuth()
  const supabase = useSupabase()
  const editorStyle = {
    height: "400px",
  }

  const toolbarStyle = {}
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

  const handleImageUpload = async (file: File) => {
    const filesize = Number((file.size / 1024 / 1024).toFixed(4))
    console.log("filesize: ", filesize)
    if (filesize > maxFileSize) {
      // showSnackbar(`파일은 ${maxFileSize}mb를 초과 할 수 없습니다.`, {
      //   color: "error",
      //   location: "bottom",
      // })
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve("")
        }, 200)
      })
    }
    const fileName = new Date().getTime().toString()
    const result = await uploadFile(
      `contents/${auth.user?.id}/${fileName}.png`,
      file,
    )
    insertImage(
      `https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/${
        result.data!.path
      }`,
    )
    console.log("result", result)
    return `https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/${
      result.data!.path
    }`
  }

  const uploadFile = async (path: string, file: File) => {
    return supabase.storage.from("artinfo").upload(path, file, {
      cacheControl: "36000",
      upsert: true,
    })
  }

  const insertImage = (url: string) => {
    const contentState = editorState.getCurrentContent()
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "IMMUTABLE",
      { src: url },
    )
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    })
    setEditorState(
      AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " "),
    )
  }

  useEffect(() => {
    console.log("editorState", editorState)
  }, [editorState])

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
      toolbar={{
        image: {
          uploadCallback: handleImageUpload,
          alt: { present: true, mandatory: true },
        },
      }}
    />
  )
}

export default Editor
