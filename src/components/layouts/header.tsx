"use client"

import { useAuth } from "@/app/(auth)/auth/components/AuthProvider"
import Link from "next/link"
import React from "react"

import {
  BriefcaseIcon,
  MusicalNoteIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PowerIcon,
  MagnifyingGlassIcon,
  BellAlertIcon,
  HomeIcon,
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import {
  Button,
  Navbar,
  Typography,
  MenuItem,
  Menu,
  MenuHandler,
  Avatar,
  MenuList,
} from "../material"

function ProfileMenu() {
  const { user, signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const router = useRouter()

  const selectMenu = (item: any) => {
    if (item.to) {
      router.push(item.to)
      return
    }

    signOut()
    setIsMenuOpen(false)
  }

  const profileMenuItems = [
    {
      key: "myprofile",
      label: "My Profile",
      icon: UserCircleIcon,
      to: `/profile/${user!.id}`,
    },
    {
      key: "signout",
      label: "Sign Out",
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
            src={
              user!.user_metadata.icon_image_url || "/img/placeholder_user.png"
            }
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
  // {
  //   title: "포스트",
  //   to: "/posts",
  //   icon: HomeIcon,
  // },
  {
    title: "채용",
    to: "/jobs",
    icon: BriefcaseIcon,
  },
  {
    title: "공연",
    to: "/concerts",
    icon: MusicalNoteIcon,
  },
  // {
  //   title: "이슈",
  //   to: "/issues",
  // },
  // {
  //   title: "교육",
  //   to: "/educations",
  // },
  // {
  //   title: "토론",
  //   to: "/debates",
  // },
  // {
  //   title: "문의",
  //   to: "/inquiry",
  // },
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
          <Link href={item.to}>
            <MenuItem className="flex items-center gap-2">
              {React.createElement(item.icon, {
                className: "h-[18px] w-[18px]",
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
  const { user, signOut } = useAuth()

  return (
    <Navbar className="sticky top-0 z-50 h-max max-w-full rounded-none py-2 px-4 lg:px-8">
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
            {/* <div>
              <Link href="/search">
                <MagnifyingGlassIcon className="w-5" />
              </Link>
            </div> */}
            <div>
              {user ? (
                <div className="flex items-center gap-x-4">
                  <Link href="/notifications">
                    <BellAlertIcon className="w-5" />
                  </Link>
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

          {/* {user ? (
            <Link href={`/profile/${user.id}`}>
              <div className="flex items-center gap-x-1.5">
                <img
                  className="inline-block h-8 w-8 rounded-full"
                  src={
                    user.user_metadata.icon_image_url ||
                    "/img/placeholder_user.png"
                  }
                  alt="profile"
                />
                <span className="text-xs">{user.user_metadata.name}님</span>
              </div>
            </Link>
          ) : (
            <Link
              href="/auth"
              className="text-sm rounded bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-white/20"
            >
              로그인
            </Link>
          )} */}
        </div>
      </div>
    </Navbar>
  )
}
