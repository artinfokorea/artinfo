"use client"

import { PROFILE } from "@/types/types"
import { atom } from "recoil"

export const userProfileState = atom({
  key: "userProfileState",
  default: "",
})
