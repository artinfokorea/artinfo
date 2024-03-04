import type { Database } from "@/types/supabase"

export type CONCERT_CATEGORY =
  | "ORCHESTRA"
  | "CHORUS"
  | "ENSEMBLE"
  | "SOLO"
  | "ETC"

export const CONCERT_CATEGORY_ITEMS = {
  ORCHESTRA: "오케스트라",
  CHORUS: "합창",
  SOLO: "솔로",
  ENSEMBLE: "앙상블",
  ETC: "기타",
}

export type IConcert = {
  id: number
  title: string
  contents?: string
  poster_url?: string | null
  count_of_views: number
  location?: string
  performance_time?: string
  created_at: string
  profile_id?: string
  category: CONCERT_CATEGORY
  link_url?: string
  is_active?: boolean
  profiles?: {
    id: string
    name: string
    email: string
    icon_image_url?: string | null
  } | null
}

export const CONCERT_CATEGORY_SELECT_ITEMS = (
  Object.keys(CONCERT_CATEGORY_ITEMS) as CONCERT_CATEGORY[]
).map(key => ({ title: CONCERT_CATEGORY_ITEMS[key], value: key }))

export type EDUCATION_CATEGORY = "CONCOURS" | "LESSON" | "SEMINAR"

export const EDUCATION_CATEGORY_ITEMS = {
  CONCOURS: "콩쿨",
  LESSON: "레슨",
  SEMINAR: "세미나",
}

export type MAJOR_CATEGORY =
  | "CONDUCT"
  | "VOCAL"
  | "VIOLIN"
  | "VIOLA"
  | "CELLO"
  | "DOUBLE_BASS"
  | "FLUTE"
  | "OBOE"
  | "CLARINET"
  | "BASSOON"
  | "HORN"
  | "TRUMPET"
  | "TROMBONE"
  | "TUBA"
  | "PERCUSSION"
  | "PIANO"
  | "ORGAN"
  | "HARP"
  | "COMPOSITION"
  | "ACCOMPANIMENT"

export const MAJOR_CATEGORY_ITEMS = {
  CONDUCT: "지휘",
  VOCAL: "성악",
  VIOLIN: "바이올린",
  VIOLA: "비올라",
  CELLO: "첼로",
  DOUBLE_BASS: "더블베이스",
  FLUTE: "플룻",
  OBOE: "오보에",
  CLARINET: "클라리넷",
  BASSOON: "바순",
  HORN: "호른",
  TRUMPET: "트럼펫",
  TROMBONE: "트럼본",
  TUBA: "튜바",
  PERCUSSION: "타악기",
  PIANO: "피아노",
  ORGAN: "오르간",
  HARP: "하프",
  COMPOSITION: "작곡",
  ACCOMPANIMENT: "반주",
}

/*
 * --------------------------------------------------- JOB ---------------------------------------------------------
 */

export type Job = {
  id: number
  title: string
  companyName: string
  companyImageUrl: string
  majors: string[]
  createdAt: string
}

export type JobDetail = {
  id: number
  title: string
  companyName: string
  companyImageUrl: string
  majors: string[]
  createdAt: string
  contents: string
  linkUrl: string
  userId: string
}

export type JOB_POSITION_1DEPTH_CATEGORY =
  | "RELIGION"
  | "LECTURER"
  | "ART_ORGANIZATION"
  | "ETC"

export const JOB_POSITION_1DEPTH_CATEGORY_ITEMS = {
  ART_ORGANIZATION: "연주단체",
  LECTURER: "교원",
  RELIGION: "종교",
  ETC: "기타",
}

export const JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_1DEPTH_CATEGORY_ITEMS,
  ) as JOB_POSITION_1DEPTH_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_1DEPTH_CATEGORY_ITEMS[key],
  value: key,
}))

export type JOB_POSITION_CHORUS_CATEGORY =
  | "CONDUCTOR"
  | "SOPRANO"
  | "ALTO"
  | "TENOR"
  | "BASS"
  | "ACCOMPANIST"

export const JOB_POSITION_CHORUS_CATEGORY_ITEMS = {
  CONDUCTOR: "지휘",
  SOPRANO: "소프라노",
  ALTO: "알토",
  TENOR: "테너",
  BASS: "베이스",
  ACCOMPANIST: "반주",
}

/*
 * --------------------------------------------------- USER ---------------------------------------------------------
 */
export type USER = {
  id: string
  name: string
  publicNickname?: string
  secretNickname?: string
  companyCategory?: COMPANY_CATEGORY
  companyName?: string
  email: string
  iconImageUrl?: string
  lessonId?: number
  isTeacher: boolean
}

export type COMPANY_CATEGORY = "CHOIR" | "ORCHESTRA"

export const COMPANY_CATEGORY_ITEMS = {
  ORCHESTRA: "ORCHESTRA",
  CHOIR: "CHOIR",
}

export const COMPANY_CATEOGRY_VALUE = {
  ORCHESTRA: "국·시립교향악단",
  CHOIR: "국·시립합창단",
}
/*
 * --------------------------------------------------- FEED ---------------------------------------------------------
 */
type FeedRow = Database["public"]["Tables"]["feeds"]["Row"]
export type Feed = {
  profiles?: {
    id: string
    name: string
    icon_image_url?: string | null
  } | null
  like?: boolean
  // user_metadata: {
  //   name: string
  //   icon_image_url?: string
  // }
} & FeedRow

export type FEED = {
  feedId: number
  authorName: string
  authorIconImageUrl?: string
  authorId: string
  title: string
  contents: string
  imageUrls: string[]
  countOfLikes: number
  countOfComments: number
  createdAt: string
  isLiking: boolean
  artistId?: number
  category: FEED_CATEGORIES
}

export type FEED_CATEGORIES = "ORCHESTRA" | "CHOIR" | "ARTIST"

export const FEED_CATEGORY_ITEMS = {
  ORCHESTRA: "ORCHESTRA",
  CHOIR: "CHOIR",
  ARTIST: "ARTIST",
}

/*
 * --------------------------------------------------- COMMENT ---------------------------------------------------------
 */
export type CommentType = Database["public"]["Enums"]["comment_type"]
type CommentRow = Database["public"]["Tables"]["comments"]["Row"]
export type Comment = {
  profiles?: {
    id: string
    name: string
    icon_image_url?: string | null
  } | null
} & CommentRow

/*
 * --------------------------------------------------- RECRUIT_JOBS ---------------------------------------------------------
 */

export type RECRUIT_JOBS_CATEGORY =
  | "RELIGION"
  | "LECTURER"
  | "ETC"
  | "ART_ORGANIZATION"

export const RECRUIT_JOBS_CATEGORY_ITEMS = {
  RELIGION: "종교",
  LECTURER: "교원",
  ETC: "기타",
  ART_ORGANIZATION: "연주단체",
}

/*
 * --------------------------------------------------- PROFILE ---------------------------------------------------------
 */

export type PROFILE = {
  alarm_recruit: boolean
  article_cnt: 40
  comment_cnt: 17
  created_at: string
  email: string
  fcm_web_token?: string
  grade?: string
  icon_image_url?: string
  id: string
  intro?: string
  major?: string
  name: string
  school?: string
}

export type PROFILE_PAYLOAD = {
  id?: string
  name?: string | null
  icon_image_url?: string | null
}

/*
 * --------------------------------------------------- LESSON ---------------------------------------------------------
 */
export type DEGREE = "ASSOCIATE" | "MASTER" | "BACHELOR" | "DOCTOR"

export type LESSON = {
  id: number
  created_at: string
  profile_id: string
  imageUrl?: string
  image_url?: string
  locations: string[]
  majors: string[]
  name: string
  subjects: string[]
  degree: { [key: string]: string }[]
  degrees: any
  profiles: PROFILE
  intro: string
  fee: number
  phone: string
  userId?: string
}

export const DEGREE_VALUES = {
  ASSOCIATE: "전문학사",
  MASTER: "석사",
  BACHELOR: "학사",
  DOCTOR: "박사",
}

/*
 * --------------------------------------------------- ARTIST ---------------------------------------------------------
 */

export type ARTIST = {
  id: number
  koreanName: string
  englishName: string
  mainImageUrl: string
}

/*
 * --------------------------------------------------- CONCERT ---------------------------------------------------------
 */

export type ARTIST_CONCERT = {
  id: number
  title: string
  location: string
  performanceTime: string
  isActive: boolean
}

export type CONCERT = {
  id: number
  posterUrl: string
  title: string
  location: string
  performanceTime: string
}

/*
 * --------------------------------------------------- YOUTUBE ---------------------------------------------------------
 */

export type YOUTUBE = {
  id: number
  artistName: string
  title: string
  linkUrl: string
  publishedAt: string
}

/*
 * --------------------------------------------------- YOUTUBE ---------------------------------------------------------
 */

export type STATISTICS = {
  visitors: number
  users: number
}
