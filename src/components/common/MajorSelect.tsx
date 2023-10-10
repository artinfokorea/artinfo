"use client"

import { RegionData } from "@/lib/regions"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useMemo, useState, useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"
import { MajorData, StringedInstruments, WindInstruments } from "@/lib/majors"

interface Props {
  isOpen: boolean
  closeModal: () => void
  handleSelectMajor: (value: string) => void
}

const MajorSelect = ({ isOpen, closeModal, handleSelectMajor }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900"
                  >
                    지역 선택
                  </Dialog.Title>
                  <IconButton
                    ripple={false}
                    variant="text"
                    size="md"
                    className=" text-black "
                    onClick={closeModal}
                  >
                    <XMarkIcon className="w-6" />
                  </IconButton>
                </div>

                <div className="mt-2 grid grid-cols-4 break-keep overflow-y">
                  {MajorData.map(major => (
                    <button
                      key={major}
                      className="m-1 bg-orange-200 text-white p-1 rounded-md text-sm"
                      onClick={() => handleSelectMajor(major)}
                    >
                      {major}
                    </button>
                  ))}
                </div>
                <span className="block mt-2 font-medium">현악기</span>
                <div className="mt-2 grid grid-cols-4 break-keep overflow-y">
                  {StringedInstruments.map(major => (
                    <button
                      key={major}
                      className="m-1 bg-orange-200 text-white p-1 rounded-md text-sm"
                      onClick={() => handleSelectMajor(major)}
                    >
                      {major}
                    </button>
                  ))}
                </div>
                <span className="block mt-2 font-medium">관악기</span>
                <div className="mt-2 grid grid-cols-4 break-keep overflow-y">
                  {WindInstruments.map(major => (
                    <button
                      key={major}
                      className="m-1 bg-orange-200 text-white p-1 rounded-md text-sm"
                      onClick={() => handleSelectMajor(major)}
                    >
                      {major}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MajorSelect
