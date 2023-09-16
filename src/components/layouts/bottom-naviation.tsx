"use client"

import useAuth from "@/hooks/useAuth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "../../../public/css/custom.css"
import { useEffect, useState } from "react"

function HomeIcon({ className }: { className?: string } = {}) {
  return (
    <svg
      className={`w-5 h-5 mb-2 ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
    </svg>
  )
}
function ProfileIcon({ className }: { className?: string } = {}) {
  return (
    <svg
      className={`w-5 h-5 mb-2 ${className}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
    </svg>
  )
}
function JobIcon({ className }: { className?: string } = {}) {
  return (
    <svg
      viewBox="0 0 490 490"
      className={`w-5 h-5 mb-2 ${className}`}
      fill="currentColor"
    >
      <g strokeWidth={0} />
      <g strokeLinecap="round" strokeLinejoin="round" />
      <g>
        <g>
          <g>
            <ellipse cx="245" cy="45.5" rx="46.3" ry="45.5" />
            <path d="M431.7,182.4L304.5,75.8c-3.1,6.2-7.4,11.7-12.4,16.7l107.3,89.8h32.3V182.4z" />
            <path d="M197.9,92.6c-5.1-5.1-9.3-10.5-12.4-16.7L58.3,182.4H91L197.9,92.6z" />
            <g>
              <ellipse cx="225.6" cy="292.7" rx="9.5" ry="23.5" />
              <path d="M200.9,376.9h-9.4v17.6h9.4c5.4,0,9.8-3.9,9.8-8.8S206.3,376.9,200.9,376.9z" />
              <path d="M0,203v287h490V203H0z M130.8,429.7c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9v-23.5h-17.6v23.5c0,3.2-2.9,5.9-6.5,5.9 s-6.5-2.6-6.5-5.9V371c0-3.2,2.9-5.9,6.5-5.9s6.5,2.6,6.5,5.9v23.5h17.6V371c0-3.2,2.9-5.9,6.5-5.9s6.5,2.6,6.5,5.9V429.7z M160.8,429.7c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9V371c0-3.2,2.9-5.9,6.5-5.9s6.5,2.6,6.5,5.9V429.7z M175.4,325l-26.9-40.5 V322c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9v-58.6c0-2.6,2-5,4.8-5.7s5.8,0.4,7.3,2.6l26.9,40.5v-37.4c0-3.2,2.9-5.9,6.5-5.9 s6.5,2.6,6.5,5.9V322c0,2.6-2,4.8-4.8,5.7C181.2,328.1,177.6,328.2,175.4,325z M223,426.3c1.6,2.9,0.2,6.5-2.9,7.9 c-2,0.9-5.9,1.6-8.8-2.6L197,406.2h-5.6v23.5c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9V371c0-3.2,2.9-5.9,6.5-5.9h15.9 c12.6,0,22.8,9.2,22.8,20.5c0,8.2-5.4,15.3-13.1,18.6L223,426.3z M225.6,327.9c-12.4,0-22.5-15.8-22.5-35.2 c0-19.4,10.1-35.2,22.5-35.2s22.5,15.8,22.5,35.2S238,327.9,225.6,327.9z M253.6,429.7c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9 V371c0-3.2,2.9-5.9,6.5-5.9s6.5,2.6,6.5,5.9V429.7z M323.8,429.7c0,2.6-2,5-4.8,5.7c-0.6,0.1-4.6,1-7.3-2.6l-26.9-40.5v37.4 c0,3.2-2.9,5.9-6.5,5.9s-6.5-2.6-6.5-5.9V371c0-2.6,2-5,4.8-5.7s5.8,0.4,7.3,2.6l26.9,40.5V371c0-3.2,2.9-5.9,6.5-5.9 s6.5,2.6,6.5,5.9V429.7z M338.4,264.8L321,323.4c-0.8,2.6-3.3,4.4-6.3,4.4s-5.5-1.8-6.3-4.4L297.2,286l-11.1,37.4 c-0.8,2.6-3.3,4.4-6.3,4.4s-5.5-1.8-6.3-4.4l-17.4-58.6c-0.9-3.1,1.1-6.3,4.6-7.2c3.5-0.8,7,1,8,4.2l11.1,37.4l9.9-36.2 c0.9-3.3,3.9-5.6,7.3-5.6s6.4,2.3,7.3,5.5l10.3,36.3l11.1-37.4c0.9-3.1,4.5-5,8-4.2C337.2,258.5,339.3,261.7,338.4,264.8z M371.3,435.6c-15,0-31.6-13.7-31.6-35.2c0-11.8,8.6-35.2,31.6-35.2c9.3,0,18,4.4,24,12.2c2.1,2.7,1.3,6.3-1.6,8.2 s-7,1.2-9.1-1.5c-3.6-4.6-8.3-7.2-13.3-7.2c-12.8,0-18.6,14.7-18.6,23.5c0,11.4,7.2,23.5,18.6,23.5c12.1,0,18-13.3,18-17.6h-18 c-3.6,0-6.5-2.6-6.5-5.9c0-3.2,2.9-5.9,6.5-5.9h25.1c3.6,0,6.5,2.6,6.5,5.9C402.9,414,393.6,435.6,371.3,435.6z" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
function ConcertIcon({ className }: { className?: string } = {}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-5 h-5 mb-2 ${className}`}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth={0} />
      <g strokeLinecap="round" strokeLinejoin="round" />
      <g id="SVGRepo_iconCarrier">
        <path d="M12.75 12.508L21.25 9.108V14.7609C20.7449 14.4375 20.1443 14.25 19.5 14.25C17.7051 14.25 16.25 15.7051 16.25 17.5C16.25 19.2949 17.7051 20.75 19.5 20.75C21.2949 20.75 22.75 19.2949 22.75 17.5C22.75 17.5 22.75 17.5 22.75 17.5L22.75 7.94625C22.75 6.80342 22.75 5.84496 22.6696 5.08131C22.6582 4.97339 22.6448 4.86609 22.63 4.76597C22.5525 4.24426 22.4156 3.75757 22.1514 3.35115C22.0193 3.14794 21.8553 2.96481 21.6511 2.80739C21.6128 2.77788 21.573 2.74927 21.5319 2.7216L21.5236 2.71608C20.8164 2.2454 20.0213 2.27906 19.2023 2.48777C18.4102 2.68961 17.4282 3.10065 16.224 3.60469L14.13 4.48115C13.5655 4.71737 13.0873 4.91751 12.712 5.1248C12.3126 5.34535 11.9686 5.60548 11.7106 5.99311C11.4527 6.38075 11.3455 6.7985 11.2963 7.25204C11.25 7.67831 11.25 8.19671 11.25 8.80858V16.7609C10.7448 16.4375 10.1443 16.25 9.5 16.25C7.70507 16.25 6.25 17.7051 6.25 19.5C6.25 21.2949 7.70507 22.75 9.5 22.75C11.2949 22.75 12.75 21.2949 12.75 19.5C12.75 19.5 12.75 19.5 12.75 19.5L12.75 12.508Z" />
        <path d="M7.75 2C7.75 1.58579 7.41421 1.25 7 1.25C6.58579 1.25 6.25 1.58579 6.25 2V7.76091C5.74485 7.4375 5.14432 7.25 4.5 7.25C2.70507 7.25 1.25 8.70507 1.25 10.5C1.25 12.2949 2.70507 13.75 4.5 13.75C6.29493 13.75 7.75 12.2949 7.75 10.5V5.0045C8.44852 5.50913 9.27955 5.75 10 5.75C10.4142 5.75 10.75 5.41421 10.75 5C10.75 4.58579 10.4142 4.25 10 4.25C9.54565 4.25 8.9663 4.07389 8.51159 3.69837C8.0784 3.34061 7.75 2.79785 7.75 2Z" />
      </g>
    </svg>
  )
}

const InquiryIcon = ({ className }: { className?: string } = {}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`w-6 h-6 mb-2 ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
      />
    </svg>
  )
}

function NavItemButton({
  title,
  href,
  icon: Icon,
}: {
  title: string
  href: string
  icon: any
}) {
  const path = usePathname()

  const defaultColor =
    "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500"
  const activeColor = "text-blue-500"
  const active = path === href
  return (
    <Link
      href={href}
      className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group"
      prefetch
    >
      <Icon
        className={`${active ? activeColor : defaultColor} ${
          title === "inquiry" && "w-5 h-5"
        }`}
      />
      <span className={`text-sm ${active ? activeColor : defaultColor}`}>
        {title}
      </span>
    </Link>
  )
}

export function BottomNavigation() {
  const { user } = useAuth()
  const [isIPhone, setIsIPhone] = useState(false)
  const items = [
    {
      title: "Home",
      href: "/posts",
      icon: HomeIcon,
    },
    {
      title: "Job",
      href: "/jobs",
      icon: JobIcon,
    },
    {
      title: "Concert",
      href: "/concerts",
      icon: ConcertIcon,
    },
    {
      title: "Login",
      href: `/auth`,
      icon: ProfileIcon,
    },
  ]
  if (user) {
    items[3] = {
      title: "Inquiry",
      href: `/inquiry`,
      icon: InquiryIcon,
    }
  }

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (userAgent.indexOf("iphone") > -1) {
      setIsIPhone(true)
    }
  }, [])

  return (
    <div
      className={`sm:hidden sticky bottom-0 left-0 z-10 w-full ${
        isIPhone ? "h-20 safe-area pt-4" : "h-16"
      } bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600`}
    >
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        {items.map(item => (
          <NavItemButton
            key={item.title}
            title={item.title}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div>
    </div>
  )
}
