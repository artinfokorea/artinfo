import type { Database } from "@/types/supabase"

export type ART_ORGANIZATION_CATEGORY =
  | "UNIVERSITY"
  | "CHORUS"
  | "ORCHESTRA"
  | "RELIGION"
  | "ETC"

export const ART_ORGANIZATION_CATEGORY_ITEMS = {
  UNIVERSITY: "대학교",
  CHORUS: "합창",
  ORCHESTRA: "오케스트라",
  RELIGION: "종교",
  ETC: "기타",
}

export type ART_RELIGION_CATEGORY =
  | "ACCOMPANIMENT"
  | "CONDUCTOR"
  | "INSTRUMENT"
  | "VOCAL"

export const ART_RELIGION_CATEGORY_ITEMS = {
  ACCOMPANIMENT: "반주자",
  CONDUCTOR: "지휘자",
  INSTRUMENT: "기악",
  VOCAL: "성악",
}
export const ART_RELIGION_CATEGORY_ITEMS_SELECT_ITEMS = (
  Object.keys(ART_RELIGION_CATEGORY_ITEMS) as ART_RELIGION_CATEGORY[]
).map(key => ({ title: ART_RELIGION_CATEGORY_ITEMS[key], value: key }))

export type RECRUIT_CATEGORY =
  | "ART_ORGANIZATION_ADULT"
  | "ART_ORGANIZATION_YOUTH"
  | "TEACHER"
  | "RELIGION"
  | "OBRI"
  | "ETC"
export const RECRUIT_CATEGORY_ITEMS = {
  ART_ORGANIZATION_ADULT: "연주단체(성인)",
  ART_ORGANIZATION_YOUTH: "연주단체(청소년)",
  RELIGION: "종교",
  OBRI: "오브리",
  TEACHER: "교원",
  ETC: "기타",
}

export const RECRUIT_CATEGORY_SELECT_ITEMS = (
  Object.keys(RECRUIT_CATEGORY_ITEMS) as RECRUIT_CATEGORY[]
).map(key => ({ title: RECRUIT_CATEGORY_ITEMS[key], value: key }))

export type OBRI_CATEGORY =
  | "CONDUCTOR"
  | "SOPRANO"
  | "ALTO"
  | "TENOR"
  | "BASS"
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

export const OBRI_CATEGORY_ITEMS = {
  CONDUCTOR: "지휘",
  SOPRANO: "소프라노",
  ALTO: "알토",
  TENOR: "테너",
  BASS: "베이스",
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
}
export const OBRI_CATEGORY_SELECT_ITEMS = (
  Object.keys(OBRI_CATEGORY_ITEMS) as OBRI_CATEGORY[]
).map(key => ({ title: OBRI_CATEGORY_ITEMS[key], value: key }))

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

export type ISSUE_CATEGORY = "ISSUE" | "FREE" | "NEWS" | "REVIEW"

export const ISSUE_CATEGORY_ITEMS = {
  FREE: "자유게시판",
  ISSUE: "이슈",
  NEWS: "뉴스",
  REVIEW: "후기",
}

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

type JobRow = Database["public"]["Tables"]["jobs"]["Row"]
export type Job = {
  // organizations?: {
  //   id: number
  //   name: string
  //   logo_image?: string
  //   desc?: string
  // } | null
  // job_positions: {
  //   position_1depth_category: string
  //   position_2depth_category?: string
  //   amount?: number
  // }[]
  title: string
  created_at: string
  category: JOB_POSITION_1DEPTH_CATEGORY
  contents: string
  company_name: string
  company_image_url: string
  profile_id: string
} & JobRow

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
  // UNIVERSITY: "대학교",
  // RELIGION: "종교단체",
  // ETC: "기타",
}

export const JOB_POSITION_1DEPTH_CATEGORY_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_1DEPTH_CATEGORY_ITEMS,
  ) as JOB_POSITION_1DEPTH_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_1DEPTH_CATEGORY_ITEMS[key],
  value: key,
}))

export type JOB_POSITION_ORCHESTRA_CATEGORY =
  | "CONDUCTOR"
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

export const JOB_POSITION_ORCHESTRA_CATEGORY_ITEMS = {
  CONDUCTOR: "지휘",
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
}

export const JOB_POSITION_ORCHESTRA_CATEGORY_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_ORCHESTRA_CATEGORY_ITEMS,
  ) as JOB_POSITION_ORCHESTRA_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_ORCHESTRA_CATEGORY_ITEMS[key],
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

export type JOB_POSITION_KOREAN_MUSIC_CATEGORY = "CONDUCTOR" | "CONCERT_MASTER"

export const JOB_POSITION_KOREAN_MUSIC_CATEGORY_ITEMS = {
  CONDUCTOR: "지휘",
  CONCERT_MASTER: "악장",
}

export const JOB_POSITION_KOREAN_MUSIC_CATEGORY_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_KOREAN_MUSIC_CATEGORY_ITEMS,
  ) as JOB_POSITION_KOREAN_MUSIC_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_KOREAN_MUSIC_CATEGORY_ITEMS[key],
  value: key,
}))

export const JOB_POSITION_ORCHESTRA_CHORUS_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_CHORUS_CATEGORY_ITEMS,
  ) as JOB_POSITION_CHORUS_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_CHORUS_CATEGORY_ITEMS[key],
  value: key,
}))

export type JOB_POSITION_ADMINISTRATION_CATEGORY =
  | "MANAGEMENT"
  | "PLANNING"
  | "MARKETING"
  | "ETC"

export const JOB_POSITION_ADMINISTRATION_CATEGORY_ITEMS = {
  MANAGEMENT: "경영",
  PLANNING: "기획",
  MARKETING: "마케팅",
  ETC: "기타",
}

export const JOB_POSITION_ADMINISTRATION_CATEGORY_SELECT_ITEMS = (
  Object.keys(
    JOB_POSITION_ADMINISTRATION_CATEGORY_ITEMS,
  ) as JOB_POSITION_ADMINISTRATION_CATEGORY[]
).map(key => ({
  title: JOB_POSITION_ADMINISTRATION_CATEGORY_ITEMS[key],
  value: key,
}))

/*
 * --------------------------------------------------- USER ---------------------------------------------------------
 */
type UserRow = Database["public"]["Tables"]["profiles"]
export type User = {
  // user_metadata: {
  //   name: string
  //   icon_image_url?: string
  // }
} & UserRow

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
}

export const FEED_CATEGORIES = {
  INFORMATION: "정보",
  RECRUIT: "채용",
  REVIEW: "공연후기",
  QUESTION: "질문",
  EVENT: "이벤트",
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
