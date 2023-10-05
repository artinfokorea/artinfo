import React from "react"

const EducationTable = () => {
  const ths = [
    { title: "번호", value: "id" },
    { title: "제목", value: "title" },
    { title: "답변받을 이메일", value: "email" },
    { title: "작성시간", value: "created_at" },
  ]

  const items = [
    {
      id: 1,
      title: "제목",
      email: "email",
      created_at: "created_at",
    },
    {
      id: 2,
      title: "제목",
      email: "email",
      created_at: "created_at",
    },
  ]

  return (
    <div className="relative overflow-x-auto mt-10">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        {/* <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {ths?.map(element => {
              return (
                <th scope="col" className="px-6 py-3" key={element.title}>
                  {element.title}
                </th>
              )
            })}
          </tr>
        </thead> */}
        <tbody>
          {items?.map((item, index) => {
            const count = Object.keys(item).length
            return (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 cursor-pointer"
                key={item.id}
              >
                {ths.map(th => (
                  <td key={th.title} className="px-6 py-4">
                    {(item as any)[th.value]}
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

export default EducationTable
