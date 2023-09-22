import { NextRequest, NextResponse } from "next/server"
import cheerio from "cheerio"
import NodeCache from "node-cache"

const pattern = /^((http|https):\/\/)/
const myCache = new NodeCache({
  stdTTL: 86400 * 30, // 1 mon
  checkperiod: 86400 * 15, // 15 day
})

async function fetchWithTimeout(
  resource: string,
  options: { timeout?: number; retry?: number },
) {
  const { timeout = 3000, retry = 0 } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  const response = await fetch(resource, {
    signal: controller.signal,
    headers: {
      "Content-Type": "text/html",
    },
  })
  clearTimeout(id)

  return response.text()
}

export async function GET(request: NextRequest) {
  const urlStr = request.nextUrl.searchParams.get("url")
  if (!urlStr) {
    throw new Error("EMPTY_URL")
  }

  const siteUrl = new URL(urlStr)
  const baseUrl = `${siteUrl.protocol}//${siteUrl.host}`

  const cacheKey = `preview-url:${urlStr}`
  const siteInfoCache = myCache.get(cacheKey)
  // console.log("siteInfoCache", siteInfoCache)
  if (siteInfoCache) {
    // return siteInfoCache
    return NextResponse.json(siteInfoCache)
  }

  const metadata = {
    fullUrl: urlStr,
    url: baseUrl,
    host: siteUrl.host,
    title: "",
    description: "",
    image: "",
    "og:site_name": "",
    "og:title": "",
    "og:url": "",
    "og:image": "",
    "og:image:alt": "",
    "og:type": "",
  } as any

  try {
    const html = await fetchWithTimeout(urlStr, {
      timeout: 3000,
    })
    const $ = cheerio.load(html as string)

    $("head > meta").each((index, element) => {
      const property = $(element).attr("property")
      const name = $(element).attr("name")
      const content = $(element).attr("content")

      if (name !== undefined && metadata[name] !== undefined)
        metadata[name] = content
      if (property !== undefined && metadata[property] !== undefined)
        metadata[property] = content
    })

    metadata.title = $("head > title").text()
    metadata.image = metadata["og:image"]

    if (!metadata["og:image"]) {
      const img = $("body img").eq(0)
      let imageSrc = $(img).attr("src")
      if (imageSrc) {
        if (!pattern.test(imageSrc)) {
          imageSrc = baseUrl + imageSrc
        }
        metadata.image = imageSrc
      }
    }

    myCache.set(cacheKey, metadata)
    console.log("metadata", metadata)
    return NextResponse.json(metadata)
  } catch (e: any) {
    const error_response = {
      status: "fail",
      message: e.message,
    }
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
