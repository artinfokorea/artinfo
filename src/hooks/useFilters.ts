import dayjs from "dayjs"
import "dayjs/locale/ko"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.locale("ko")

export default function useFilters() {
  return {
    YYYYMMDD(date?: Date | string | null, format = "YYYY.MM.DD") {
      if (!date) {
        return null
      }
      return dayjs(date).format(format)
    },
    IS_DATE_FUTURE(value?: string | null | Date) {
      if (!value) {
        return false
      }
      return new Date(value) > new Date()
    },
    DIFF_FROM_NOW(value?: string | Date | null) {
      if (!value) {
        return undefined
      }
      const d = dayjs(value) as any
      return d.diff(dayjs().startOf("day"), "day")
    },
    DIFF(
      value?: string | Date | null,
      unit?:
        | "hour"
        | "millisecond"
        | "second"
        | "minute"
        | "day"
        | "month"
        | "year"
        | "date"
        | "milliseconds",
    ) {
      if (!value) {
        return undefined
      }
      const now = dayjs()
      const d = dayjs(value) as any
      return now.diff(d, unit ?? "hour")
    },
    FROM_NOW(value?: string | Date | null) {
      if (!value) {
        return undefined
      }
      return dayjs(value).fromNow()
    },
    EXTRACT_URL(text?: string) {
      if (!text) {
        return null
      }

      // 정규식 패턴
      const urlPattern = /(https?:\/\/[^\s]+)/

      // 텍스트에서 URL 추출
      const match = text.match(urlPattern)

      // console.error('URL을 찾을 수 없습니다.')
      return match ? match[0] : null
    },
  }
}
