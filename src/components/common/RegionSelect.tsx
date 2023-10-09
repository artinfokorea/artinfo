"use client"

import { RegionData } from "@/lib/regions"
import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useMemo, useState, useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { IconButton } from "@material-tailwind/react"

interface Props {
  isOpen: boolean
  closeModal: () => void
  selectedCity: string
  handleSelectCity: (value: string) => void
  districtList: string[] | null
  selectStep: number
  handleSelectDistrict: (value: string) => void
}

const RegionSelect = ({
  isOpen,
  closeModal,
  selectedCity,
  handleSelectCity,
  districtList,
  selectStep,
  handleSelectDistrict,
}: Props) => {
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
                    className="text-lg font-medium leading-6 text-gray-900"
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
                {selectStep === 1 && (
                  <div className="mt-2 grid grid-cols-4 break-keep overflow-y">
                    {Object.keys(RegionData).map(region => (
                      <button
                        key={region}
                        className="m-1 bg-orange-200 text-white p-1 rounded-md text-sm"
                        onClick={() => handleSelectCity(region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
                {selectStep === 2 && selectedCity && (
                  <div className="grid grid-cols-3">
                    {districtList?.map(district => (
                      <button
                        key={district}
                        className="m-1 bg-orange-200 text-white p-1 px-2 rounded-md text-sm"
                        onClick={() => handleSelectDistrict(district)}
                      >
                        {district}
                      </button>
                    ))}
                  </div>
                )}

                {/* <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Got it, thanks!
                  </button>
                </div> */}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default RegionSelect
