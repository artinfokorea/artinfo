"use client"
import { useRouter } from "next/navigation"
import React from "react"
import Image from "next/image"

interface IProps {
  ths: { title: string; value: string }[]
  items: any[]
  to: string
}

const Table = ({ ths, items, to }: IProps) => {
  const router = useRouter()

  const goToDetail = (id: string) => {
    router.push(`/admin/${to}/${id}`)
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {ths?.map(element => {
              return (
                <th scope="col" className="px-6 py-3" key={element.title}>
                  {element.title}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {items?.map((item, index) => {
            const count = Object.keys(item).length
            return (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 cursor-pointer"
                onClick={() => goToDetail(item.id)}
                key={item.id}
              >
                {ths.map(th => (
                  <td key={th.title} className="px-6 py-4">
                    {item[th.value]}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
