"use client"

import { Modal } from "@/components/common/Modal"
import useToast from "@/hooks/useToast"
import { TrashIcon } from "@heroicons/react/20/solid"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter } from "next/navigation"
import React, { useState } from "react"

interface Props {
  deleteFunc: (itemId: number) => any
  itemId: number
  title: string
}

const ConcertDeleteButton = ({ deleteFunc, itemId, title }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const router = useRouter()
  const { successToast, errorToast } = useToast()
  const queryClient = useQueryClient()
  const pathname = usePathname()
  const listPath = pathname.slice(0, pathname.lastIndexOf("/"))

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => {
      return deleteFunc(itemId)
    },
    onError: (error: any) => {
      errorToast(error.message)
    },
    onSuccess: () => {
      router.push(listPath)
      queryClient.invalidateQueries()
      successToast("정상적으로 삭제되었습니다.")
    },
  })

  const handleDeleteConcert = () => {
    setIsOpenModal(true)
    if (itemId) {
      deleteMutation.mutate(itemId)
    } else {
      errorToast("삭제할 수 없습니다.")
    }
  }
  return (
    <>
      <button className="mr-2">
        <TrashIcon className="w-5  " />
      </button>
      <Modal
        title={title}
        isOpen={isOpenModal}
        closeModal={() => setIsOpenModal(false)}
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">정말 삭제하시겠습니까?</p>
        </div>

        <div className="mt-4 flex items-end justify-end">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-300 text-white px-4 py-2 text-sm font-medium  hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mr-2"
            onClick={() => setIsOpenModal(false)}
          >
            취소
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={handleDeleteConcert}
          >
            확인
          </button>
        </div>
      </Modal>
    </>
  )
}

export default ConcertDeleteButton
