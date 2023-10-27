"use client"

import { atom } from "recoil"

export const userProfileState = atom({
  key: "userProfileState",
  default: {
    name: "",
    userImage: "",
  },
})
