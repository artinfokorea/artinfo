import useSupabase from "@/hooks/useSupabase"
import { CommentType, JOB_POSITION_1DEPTH_CATEGORY } from "@/types/types"

/* ****************************************************** CONNCERT ****************************************************** */
export async function fetchConcerts(category?: string) {
  const match = {} as any
  if (category) {
    match.category = category
  }
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("concerts")
    .select(
      "id, title, poster_url, location, performance_time, created_at, profiles(id, name)",
    )
    .match(match)
    .limit(50)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }
  return data
}
export async function fetchConcert(id: number) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("concerts")
    .select("*, profiles(id, name, email, icon_image_url)")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }

  await supabase
    .from("concerts")
    .update({ count_of_views: data.count_of_views + 1 })
    .eq("id", id)
  return data
}

/* ****************************************************** JOB ****************************************************** */
export async function fetchJobs(
  category: JOB_POSITION_1DEPTH_CATEGORY | "ALL",
  page: number,
) {
  const supabase = useSupabase()
  const itemCount = 10
  const isFilter = category === "ALL"
  const type = category !== "ALL" ? category : "RELIGION"

  const { data, error } = await supabase.rpc("get_recruit_jobs", {
    type,
    filter_all: isFilter,
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

/* ****************************************************** FEED ****************************************************** */
type FeedsPayload = {
  pageParam?: number
  itemCount?: number
  user_id?: string
}
export async function fetchFeeds({
  pageParam = 1,
  itemCount = 10,
  user_id,
}: FeedsPayload) {
  const supabase = useSupabase()
  // const { data, error } = await supabase
  //   .from("feeds")
  //   .select("*, profiles(id, name, icon_image_url)", {
  //     count: "exact",
  //   })
  //   .order("id", {
  //     ascending: false,
  //   })
  //   .limit(itemCount)
  //   .range((pageParam - 1) * itemCount, pageParam * itemCount - 1)

  const { data, error } = await supabase.rpc("get_posts", {
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

/* ****************************************************** COMMENT ****************************************************** */
type CommentsPayload = {
  postId: number
  pageParam?: number
  itemCount?: number
}
export async function fetchComments({
  postId,
  pageParam = 0,
  itemCount = 10,
}: CommentsPayload) {
  const supabase = useSupabase()
  const { data, count, error } = await supabase
    .from("comments")
    .select("*, profiles(id, name, icon_image_url)", {
      count: "exact",
    })
    .match({ type: "POST", post_id: postId })
    .order("id", {
      ascending: false,
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
}
export async function createComment({
  postId,
  contents,
  type,
  profile_id,
}: CreateCommentPayload) {
  const supabase = useSupabase()
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      contents: contents.trim(),
      type,
      profile_id,
    })
    .select("id")
    .single()

  if (error) {
    throw error
  }

  return data.id
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
  } else {
    await likeTable.delete().match({
      profile_id: user_id,
      table_id: post_id,
      type: "POST",
    })
  }
}
