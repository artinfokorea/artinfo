"use client"

import { JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS, JOB_POSITION_1DEPTH_CATEGORY} from "@/types/types"

interface IProps {
  category: string
  updatedCategory?: (category: "ALL" | JOB_POSITION_1DEPTH_CATEGORY) => void
}

export default function JobCategory({ category, updatedCategory }: IProps) {
  // const [category, selectCategory] = useState("ALL")

  const categoryItems = [
    { title: "전체", value: "ALL" },
    ...JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS,
  ]

  const handleUpdateCategory = (selectedCategory: "ALL" | JOB_POSITION_1DEPTH_CATEGORY) => {
    if (updatedCategory) {
      updatedCategory(selectedCategory)
    }
  }

  return (
    <div className="flex flex-wrap gap-y-2">
      {categoryItems.map(item => {
        const selected = category === item.value
        return (
          <button
            key={item.value}
            onClick={() =>
              handleUpdateCategory(item.value as "ALL" | JOB_POSITION_1DEPTH_CATEGORY)
            }
          >
            <span
              className={`${
                selected ? "bg-indigo-500 text-white" : "border border-gray-500"
              } inline-flex items-center rounded-2xl px-4 text-sm py-1 font-medium ring-1 ring-inset ring-indigo-700/10 mx-2 gap-x-1.5`}
            >
              {selected && (
                <svg
                  viewBox="0 0 40 40"
                  className="h-5 w-5 stroke-white stroke-2 -ml-2 -mt-1.5"
                >
                  <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              )}
              {item.title}
            </span>
          </button>
        )
      })}
    </div>
  )
}
