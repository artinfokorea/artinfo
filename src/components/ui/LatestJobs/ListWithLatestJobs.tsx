"use client"

import Image from "next/image"
import { Card } from "@/components/material"
import { useQuery } from "@tanstack/react-query"
import { fetchJobs } from "@/app/Api"
import Link from "next/link"

export default function ListWithLatestJobs() {
  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    suspense: true,
    queryFn: () => fetchJobs("ALL", 1),
  })

  return (
    <Card className="">
      <div className="px-4 pt-4">
        <h5 className="font-bold">최근 Job TOP 10</h5>
        <div className="text-sm">최근 채용에 올라온 게시물 입니다.</div>
      </div>

      <div className="mt-2 px-4 pt-4 pb-2">
        {jobs?.map(job => (
          <Link key={job.id} href={`/jobs/${job.id}`} prefetch={false}>
            <div className="flex flex-wrap items-center mb-6">
              <div
                style={{ width: 36, height: 36 }}
                className="rounded-md bg-gray-300 mr-2 overflow-hidden relative"
              >
                {job.company_image_url && (
                  <Image
                    src={job.company_image_url}
                    alt="아트인포"
                    fill
                    quality={100}
                    sizes="40px"
                    style={{ objectFit: "cover" }}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold leading-4 text-sm line-clamp-1">
                  {job.title}
                </div>
                <div className="text-xs text-gray-400">
                  {job.company_name}
                  {/* <span> • </span>
                지휘 1명 */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* <List>
        <ListItem>
          <ListItemPrefix>
            <div
              style={{ width: 40, height: 40 }}
              className="rounded-md bg-gray-300 mr-2 overflow-hidden relative"
            >
              <Image
                src="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/organization/1690881141550.png"
                alt="아트인포"
                fill
                sizes="40px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </ListItemPrefix>
          <div>
            <Typography variant="h6" color="blue-gray">
              2023 부평구립여성합창단 지휘자 채용 공고
            </Typography>
            <Typography variant="small" color="gray" className="font-normal">
              지휘 1명
            </Typography>
          </div>
        </ListItem>
      </List> */}
    </Card>
  )
}
