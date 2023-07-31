"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

interface IProps {
  job: {
    id: number
    title: string
    address: string
    poster_images: string[]
    organizations: {
      id: number
      name: string
    }
  }
}

export default function JobHomeCard({ job }: IProps) {
  const router = useRouter()

  const getAddress = (address: string) => {
    const addressArr = address.split(" ")
    return `${addressArr[0]} ${addressArr[1]}`
  }

  const moveToJob = () => {
    // router.push("/")
  }

  return (
    <div className="card cursor-pointer" onClick={moveToJob}>
      <div className="overflow-hidden relative" style={{ height: "150px" }}>
        <Image
          src={job.poster_images[0]}
          alt="Vercel Logo"
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 1200px) 276px, 150px"
          // sizes="(max-width: 1200px) 160px, 50px"
          className="max-w-full hover:scale-125 transition ease delay-200"
        />
      </div>
      <div className="mt-2 mb-1 text-sm">{job.organizations.name}</div>
      <div className="text-base font-semibold">{job.title}</div>
      <div className="text-sm mt-2 text-[grey]">{getAddress(job.address)}</div>
    </div>
  )
}
