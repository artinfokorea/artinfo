import useSupabase from "@/hooks/useSupabase"
import { EDUCATION_CATEGORY_ITEMS } from "@/types/types"
import dayjs from "dayjs"

export default async function EducationContainer() {
  const supabase = useSupabase()
  const { data: educations, error } = await supabase
    .from("educations")
    .select("id, category, title, created_at")
    .order("id", {
      ascending: false,
    })
    .limit(5)

  return (
    <ul className="mt-4">
      {educations?.map((item, idx) => {
        const date = dayjs(item.created_at).format("YYYY.MM.DD")
        return (
          <li
            key={item.id}
            className="flex border-b border-stone-800 pb-2 mb-4"
          >
            <div className="flex-1 flex items-center">
              <span className="text-gray-500 mr-2 text-sm">
                [{EDUCATION_CATEGORY_ITEMS[item.category]}]
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
