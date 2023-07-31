"use client"

import { Fragment } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

interface IProps {
  label?: string
  items: { title: string; value: string }[]
  selectedItem: { title: string; value: string }
  updateItem?: (value: string) => void
}

export default function SelectMenu({
  label,
  items,
  selectedItem,
  updateItem,
}: IProps) {
  const handleChange = (item: any) => {
    if (updateItem) {
      updateItem(item)
    }
  }

  return (
    <Listbox value={selectedItem.value} onChange={handleChange}>
      {({ open }) => (
        <div className="relative mt-2">
          <div className="bg-zinc-900 py-2 pl-3 rounded-md">
            <Listbox.Label className="block text-xs font-medium leading-6">
              {label}
            </Listbox.Label>
            <Listbox.Button className="relative w-full cursor-default pr-10 text-left shadow-sm sm:leading-6 pb-1">
              <span className="block truncate">{selectedItem.title}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
          </div>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {items.map(item => (
                <Listbox.Option
                  key={`item-${item.value}`}
                  className={({ active }) =>
                    classNames(
                      active ? "bg-indigo-600 text-white" : "text-gray-900",
                      "relative cursor-default select-none py-2 pl-9",
                    )
                  }
                  value={item.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          selected ? "font-semibold" : "font-normal",
                          "block truncate",
                        )}
                      >
                        {item.title}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-indigo-600",
                            "absolute inset-y-0 left-0 flex items-center pl-3",
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
