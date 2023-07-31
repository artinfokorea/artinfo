import useSupabase from "@/hooks/useSupabase"
import { ISSUE_CATEGORY_ITEMS } from "@/types/types"
import dayjs from "dayjs"

export default async function IssueContainer() {
  const supabase = useSupabase()
  const { data: issues, error } = await supabase
    .from("issues")
    .select("id, category, title, created_at")
    .order("id", {
      ascending: false,
    })
    .limit(5)

  return (
    <ul className="mt-4">
      {issues?.map((item, idx) => {
        const date = dayjs(item.created_at).format("YYYY.MM.DD")
        return (
          <li
            key={item.id}
            className="flex border-b border-stone-800 pb-2 mb-4"
          >
            <div className="flex-1 flex items-center">
              <span className="text-gray-500 mr-2 text-sm">
                [{ISSUE_CATEGORY_ITEMS[item.category]}]
              </span>
              {item.title}
            </div>
            <span className="text-sm">{date}</span>
          </li>
        )
      })}
    </ul>
  )
}
