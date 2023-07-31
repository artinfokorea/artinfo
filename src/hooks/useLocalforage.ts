"use client"

import localForage from "localforage"

const isServer = typeof window === "undefined"

if (!isServer) {
  localForage.config({
    driver: localForage.INDEXEDDB,
    name: "Artinfo",
    version: 1.0,
    storeName: "artinfo",
    description: "sharedLinkUrls",
  })
}

export default function useLocalforge() {
  const setLocalData = async (key: string, data: any) => {
    await localForage.setItem(key, JSON.stringify(data))
  }
  const getLocalData = async <T>(key: string) => {
    const result: any = await localForage.getItem(key)
    if (!result) {
      return undefined
    }
    return JSON.parse(result) as T
  }
  return {
    getLocalData,
    setLocalData,
  }
}
