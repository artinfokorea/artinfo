"use client"

import { useAuth } from "@/components/ui/Auth/AuthProvider"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
  BriefcaseIcon,
  MusicalNoteIcon,
  ChevronDownIcon,
  PowerIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  AcademicCapIcon,
  StarIcon,
  TicketIcon,
} from "@heroicons/react/24/outline"
import { usePathname, useRouter } from "next/navigation"
import {
  Button,
  Navbar,
  Typography,
  MenuItem,
  Menu,
  MenuHandler,
  Avatar,
  MenuList,
} from "@/components//material"
import { fetchProfile } from "@/app/Api"
import { userProfileState } from "@/atoms/userProfile"
import { useRecoilState } from "recoil"
import { isMobileWeb } from "@toss/utils"
import { scrollDirState } from "@/atoms/scrollDir"
import { getUser } from "@/apis/user"

function ProfileMenu() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useRecoilState(userProfileState)
  const router = useRouter()
  const isMobile = isMobileWeb()

  const selectMenu = (item: any) => {
    if (item.to) {
      router.push(item.to)
      return
    }

    signOut()
    setIsMenuOpen(false)
    setUserProfile({ name: "", userImage: "" })
  }

  const profileMenuItems = [
    {
      key: "myprofile",
      label: "내 프로필",
      icon: UserCircleIcon,
      to: `/profile/${user!.id}`,
    },
    {
      key: "inquiry",
      label: "문의하기",
      icon: QuestionMarkCircleIcon,
      to: `/inquiry`,
    },
    {
      key: "signout",
      label: "로그아웃",
      icon: PowerIcon,
    },
  ]

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="tania andrew"
            className="border border-blue-500 p-0.5"
            src={userProfile.userImage || "/img/placeholder_user.png"}
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map((item, key) => {
          const isLastItem = key === profileMenuItems.length - 1
          return (
            <MenuItem
              key={item.key}
              onClick={() => selectMenu(item)}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(item.icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {item.label}
              </Typography>
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  )
}

const items = [
  {
    title: "채용",
    to: "/jobs",
    icon: BriefcaseIcon,
    prefetch: true,
  },
  {
    title: "공연",
    to: "/concerts",
    icon: TicketIcon,
    prefetch: true,
  },
  {
    title: "레슨",
    to: "/educations",
    icon: AcademicCapIcon,
    prefetch: true,
  },
  {
    title: "아티스트",
    to: "/artists",
    icon: MusicalNoteIcon,
    prefetch: true,
  },
  {
    title: "문의",
    to: "/inquiry",
    icon: QuestionMarkCircleIcon,
    prefetch: true,
  },
]

function NavList() {
  return (
    <ul className="flex gap-2 lg:mb-0 lg:mt-0 items-center">
      {items.map(item => (
        <Typography
          key={item.to}
          as="li"
          variant="small"
          color="blue-gray"
          className="font-normal"
        >
          <Link href={item.to} prefetch={item.prefetch}>
            <MenuItem className="flex items-center gap-2">
              {React.createElement(item.icon, {
                className: "h-[18px] w-[18px] mb-1",
              })}
              {item.title}
            </MenuItem>
          </Link>
        </Typography>
      ))}
    </ul>
  )
}

export default function Header() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useRecoilState(userProfileState)
  const isMobile = isMobileWeb()
  const [scrollDir, setScrollDir] = useRecoilState(scrollDirState)
  const pathname = usePathname()

  useEffect(() => storePathValues, [pathname])

  function storePathValues() {
    const storage = globalThis?.sessionStorage
    if (!storage) return

    storage.setItem("currentPath", pathname)
  }

  useEffect(() => {
    if (user) {
      getUser(user.id)
        .then(res => {
          setUserProfile({
            userImage: res.iconImageUrl || "/img/placeholder_user.png",
            name: res.publicNickname ?? res.name,
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [user])

  return (
    <Navbar
      className={`fixed top-0 left-0 z-50 h-max max-w-full rounded-none py-2 px-4  lg:px-8 ${
        isMobile && scrollDir === "scrollDown" && "hidden"
      }`}
      style={{ background: "white" }}
    >
      <div className="flex items-center text-blue-gray-900 mx-auto max-w-screen-lg">
        <Typography className="py-1.5 font-bold text-xl" as="h1">
          <Link href="/">ARTINFO</Link>
        </Typography>
        <div className="flex items-center gap-4 flex-1 ml-10">
          <div className="mr-4 flex items-center flex-1">
            <div className="hidden sm:block">
              <NavList />
            </div>
          </div>

          <div className="ml-10 flex items-center gap-x-4">
            {userProfile.name && !isMobile && (
              <span className="text-sm whitespace-pre-line">
                {userProfile.name} 님
              </span>
            )}
            <div>
              {user ? (
                <div className="flex items-center gap-x-4">
                  <ProfileMenu />
                </div>
              ) : (
                <Link href="/auth" className="text-sm font-semibold">
                  <Typography variant="small" className="font-normal">
                    로그인
                  </Typography>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  )
}
