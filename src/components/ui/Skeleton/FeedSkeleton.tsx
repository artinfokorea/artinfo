import React from "react"
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
} from "@/components/material"
import { BookmarkIcon, ShareIcon } from "@heroicons/react/24/outline"

const FeedSkeleton = () => {
  return (
    <Card className="my-4 skeleton-list-item">
      <CardHeader
        shadow={false}
        floated={false}
        className="flex items-center gap-2"
      >
        <Avatar
          size="md"
          variant="circular"
          src="/img/placeholder_user.png"
          alt="user profile"
        />
        <div className="flex-1 flex flex-col">
          <div className="text-md font-semibold" />
          <div className="text-xs -mt-0.5">
            {/* Frontend Lead @ Google
            <span> • </span> */}
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <div className="mb-2">
          <div className="flex items-center gap-x-2 mb-4">
            <div className="text-md font-bold" />
          </div>
        </div>
      </CardBody>
      <CardFooter className="pt-0 flex items-center justify-between">
        <button className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="black"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g strokeLinecap="round" strokeLinejoin="round" />
            <g>
              <path
                d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                fill="currentColor"
              />
            </g>
          </svg>
          <span className="mt-1 text-sm font-semibold text-black">
            {/* {feed.count_of_likes} */}
          </span>
        </button>

        <div className="flex items-center gap-x-4">
          <button>
            <ShareIcon className="w-5" />
          </button>
          <button>
            <BookmarkIcon className="w-5" />
          </button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default FeedSkeleton
