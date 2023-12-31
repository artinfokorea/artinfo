import useSupabase from "@/hooks/useSupabase"
import {
  CONCERT_CATEGORY,
  CommentType,
  IConcert,
  JOB_POSITION_1DEPTH_CATEGORY,
  PROFILE_PAYLOAD,
} from "@/types/types"

/* ****************************************************** CONNCERT ****************************************************** */
export async function fetchConcerts(
  page_number: number,
  category?: CONCERT_CATEGORY | "ALL",
) {
  const item_count = 12
  const type = category !== "ALL" ? category : null
  const supabase = useSupabase()
  const { data, error } = await supabase.rpc("get_concerts", {
    type: type as CONCERT_CATEGORY,
    item_count,
    page_number,
  })
  if (error) {
    throw error
  }
  return data
}

// export async function fetchConcertsByArtist(
//   page_number: number,
//   artistId: number,
// ) {
//   const item_count = 12
//   const supabase = useSupabase()
//   const { data, error } = await supabase
//     .from("concerts")
//     .select("*, artists(id,korean_name,english_name,main_image_url)")
//     .eq("artist_id", artistId)
//     .order("created_at", {
//       ascending: false,
//     })
//     .limit(item_count)
//     .range((page_number - 1) * item_count, page_number * item_count - 1)

//   if (error) {
//     throw error
//   }
//   return data
// }

export async function fetchConcert(id: number): Promise<IConcert> {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("concerts")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }

  return data
}

export async function deleteConcert(id: number) {
  const supabase = useSupabase()

  // const { data, error } = await supabase.from("feeds").delete().eq("id", id)
  const { data, error } = await supabase.from("concerts").delete().eq("id", id)

  if (error) {
    throw error
  }
  return data
}

/* ****************************************************** JOB ****************************************************** */
export async function fetchJobs(
  category: JOB_POSITION_1DEPTH_CATEGORY | "ALL",
  page: number,
) {
  const supabase = useSupabase()
  const itemCount = 20
  const type = category !== "ALL" ? category : null

  const { data, error } = await supabase.rpc("get_recruit_jobs", {
    type: type as JOB_POSITION_1DEPTH_CATEGORY,
    item_count: itemCount,
    page_number: page,
  })

  if (error) {
    throw error
  }
  return data
}

export async function fetchJob(id: number) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("recruit_jobs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }

  // await supabase
  //   .from("jobs")
  //   .update({ count_of_views: (data.count_of_views || 0) + 1 })
  //   .eq("id", id)

  return data
}

export async function deleteJob(id: number) {
  const supabase = useSupabase()

  // const { data, error } = await supabase.from("feeds").delete().eq("id", id)
  const { data, error } = await supabase
    .from("recruit_jobs")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
  return data
}

/* ****************************************************** FEED ****************************************************** */
type FeedsPayload = {
  pageParam?: number
  itemCount?: number
  user_id?: string
}
export async function fetchFeeds({
  pageParam = 1,
  itemCount = 20,
}: FeedsPayload) {
  const supabase = useSupabase()

  const { data, error } = await supabase.rpc("get_feeds", {
    item_count: itemCount,
    page_number: pageParam,
  })

  if (error) {
    throw error
  }
  return data
}

export async function fetchFeed(id: number) {
  const supabase = useSupabase()
  // const { data, error } = await supabase
  //   .from("feeds")
  //   .select("*, profiles(id, name, icon_image_url)")
  //   .eq("id", id)
  //   .single()

  const { data, error } = await supabase
    .rpc("get_feed", {
      feed_id: id,
    })
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function deleteFeed(id: number) {
  const supabase = useSupabase()

  // const { data, error } = await supabase.from("feeds").delete().eq("id", id)
  const { data, error } = await supabase
    .from("feeds")
    .update({
      deleted: true,
    })
    .eq("id", id)

  if (error) {
    throw error
  }
  return data
}

/* ****************************************************** COMMENT ****************************************************** */
type CommentsPayload = {
  postId: number
  pageParam?: number
  itemCount?: number
}
export async function fetchComments({
  postId,
  pageParam = 0,
  itemCount = 20,
}: CommentsPayload) {
  const supabase = useSupabase()
  const { data, count, error } = await supabase
    .from("comments")
    .select("*, profiles(id, name, icon_image_url)", {
      count: "exact",
    })
    .match({ type: "POST", post_id: postId })
    .order("created_at", {
      ascending: true,
    })
    .limit(itemCount)
    .range(pageParam * itemCount, (pageParam + 1) * itemCount - 1)

  if (error) {
    throw error
  }
  return { comments: data, count }
}

type CreateCommentPayload = {
  postId: number
  contents: string
  type: CommentType
  profile_id: string
  created_at: string
}
export async function createComment({
  postId,
  contents,
  type,
  profile_id,
  created_at,
}: CreateCommentPayload) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      contents: contents.trim(),
      type,
      profile_id,
      created_at,
    })
    .select("id")
    .single()

  if (error) {
    throw error
  }

  await supabase.rpc("increment_feed_comment", {
    feed_id: postId,
  })

  return data.id
}

export async function deleteComment(postId: number) {
  const supabase = useSupabase()
  const { error } = await supabase.from("comments").delete().eq("id", postId)

  if (error) {
    throw error
  }
}

/* ****************************************************** ADVERTISEMENT ****************************************************** */
export async function fetchAds() {
  const supabase = useSupabase()
  return supabase.rpc("get_advertisement_posters")
}

export async function fetchSiteMetaData(site: string) {
  const data = await (await fetch(`/api/site-preview?url=${site}`)).json()
  return data
}

/* ****************************************************** LIKE:POST ****************************************************** */
export async function updatePostLike({
  like,
  user_id,
  post_id,
}: {
  like: boolean
  user_id: string
  post_id: number
}) {
  const supabase = useSupabase()

  const likeTable = supabase.from("likes")
  if (like) {
    await likeTable.insert({
      profile_id: user_id,
      table_id: post_id,
      type: "POST",
    })
    await supabase.rpc("increment_feed_like", {
      feed_id: post_id,
    })
  } else {
    await likeTable.delete().match({
      profile_id: user_id,
      table_id: post_id,
      type: "POST",
    })
    await supabase.rpc("decrement_feed_like", {
      feed_id: post_id,
    })
  }
}
/* ****************************************************** PROFILE ****************************************************** */

export async function fetchProfile(id: string) {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)

  if (error) {
    throw error
  }
  return data
}

export const updateProfile = async (payload: PROFILE_PAYLOAD) => {
  const supabase = useSupabase()
  const updateData: any = {}

  if (payload.name) {
    updateData.name = payload.name
  }

  if (payload.icon_image_url) {
    updateData.icon_image_url = payload.icon_image_url
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", payload.id as string)

  if (error) {
    throw error
  }

  return data
}

/* ****************************************************** LESSON ****************************************************** */

type LessonsPayload = {
  pageParam?: number
  itemCount?: number
}

export async function fetchLessons({ pageParam = 1 }: LessonsPayload) {
  const itemCount = 12
  const supabase = useSupabase()
  const { data, count, error } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, icon_image_url)", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    })
    .limit(itemCount)
    .range(pageParam * itemCount, (pageParam + 1) * itemCount - 1)

  if (error) {
    throw error
  }
  return { lessons: data, count }
}

export async function fetchLesson(lessonId: number) {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, icon_image_url)")
    .eq("id", lessonId)
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function deleteLesson(id: number) {
  const supabase = useSupabase()

  const { data: lessonData, error: lessonError } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, icon_image_url)")
    .eq("id", id)
    .single()

  if (lessonError) {
    throw lessonError
  }

  const { data, error: deleteError } = await supabase
    .from("lessons")
    .delete()
    .eq("id", id)

  if (deleteError) {
    throw deleteError
  }

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .update({ is_teacher: false })
    .eq("id", lessonData.profile_id)

  // console.log("profileData", profileData)
  // console.log("profileError", profileError)

  if (profileError) {
    throw profileError
  }
  return data
}

export async function fetchUserLesson(userId: string) {
  const supabase = useSupabase()

  const { data, error } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, icon_image_url)")
    .eq("profile_id", userId)
    .single()

  if (error) {
    throw error
  }
  return data
}

export async function fetchAdLessons() {
  const itemCount = 10 // 최신 10개의 아이템을 가져오기 위해 itemCount를 10으로 설정
  const supabase = useSupabase()
  const { data, count, error } = await supabase
    .from("lessons")
    .select("*, profiles(id, name, icon_image_url)", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    })
    .filter("isAd", "eq", true)
  // .limit(itemCount)

  if (error) {
    throw error
  }

  return { lessons: data, count }
}

/* ****************************************************** BANNER ****************************************************** */

export async function fetchBanners() {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("advertisements")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .filter("type", "eq", "BANNER")

  if (error) {
    throw error
  }
  return data
}
