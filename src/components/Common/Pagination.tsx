import React, { Dispatch, SetStateAction } from "react"
import { Button, IconButton } from "@material-tailwind/react"
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline"
import { isMobileWeb } from "@toss/utils"

interface IProps {
  page: number
  totalCount: number
  setPage: Dispatch<SetStateAction<number>>
}

export function Pagination({ page, totalCount, setPage }: IProps) {
  const numButtons = Math.ceil(totalCount / 10)
  const isMobile = isMobileWeb()

  const next = () => {
    if (page === 5) return

    setPage(page + 1)
  }

  const prev = () => {
    if (page === 1) return

    setPage(page - 1)
  }

  const handlePage = (page: number) => {
    setPage(page)
  }

  const getItemProps = (index: number) =>
    ({
      variant: page === index ? "filled" : "text",
      color: "light-blue",
    }) as any

  const renderIconButtons = () => {
    const buttons = []
    for (let i = 1; i <= numButtons; i++) {
      buttons.push(
        <IconButton key={i} {...getItemProps(i)} onClick={() => handlePage(i)}>
          {i}
        </IconButton>,
      )
    }
    return buttons.slice(0, isMobile ? 3 : 5)
  }

  return (
    <div className="flex items-center gap-2  mt-3 md:gap-4 md:w-1/2 md:mx-auto">
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={page === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
      </Button>
      <div className="flex items-center gap-2">{renderIconButtons()}</div>
      <Button
        variant="text"
        className="flex items-center gap-2"
        onClick={next}
        disabled={page === 5}
      >
        Next
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </Button>
    </div>
  )
}
