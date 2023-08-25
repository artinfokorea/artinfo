"use client"

import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { fetchJob } from "@/app/Api"
import { useRouter } from "next/navigation"
import { ShareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

interface IProps {
  jobId: number
}

export default function Container({ jobId }: IProps) {
  const router = useRouter()

  const { data: job } = useQuery({
    queryKey: ["job", jobId],
    suspense: true,
    queryFn: () => fetchJob(jobId),
  })

  return (
    <div className="sm:container mx-auto mt-4 relative pb-10 px-4">
      <div className="flex">
        <div className="flex-1">
          <div className="w-full overflow-hidden relative">
            {job?.company_image_url?.length && (
              <Image
                src={job?.company_image_url}
                alt="아트인포"
                layout="responsive"
                sizes="(max-width: 480px) 800px, (max-width: 1200px) 1200px, 400px"
                width={1200}
                height={400}
              />
            )}
          </div>

          <section className="my-6">
            <h2 className="text-3xl font-semi-bold mb-2 break-keep">
              {job?.title}
            </h2>
            <div className="flex items-center">
              <div className="text-xl mr-2">{job?.company_name}</div>
              {/* <div className="text-gray-500">
                {address[0]}
                <span style={{ position: "relative", top: -5 }}>.</span>
                {address[1]}
              </div> */}
            </div>
          </section>
          {job?.contents && (
            <div
              className="w-10/12 mx-auto"
              dangerouslySetInnerHTML={{ __html: job.contents }}
            />
          )}

          {/* <section className="my-10">
            <h3 className="text-lg font-semibold mb-2">채용 중인 포지션</h3>
            <div className="flex flex-wrap gap-2">
              {job?.job_positions.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-500 p-2 rounded"
                >
                  {
                    (JOB_POSITION_1DEPTH_CATEGORY_ITEMS as any)[
                      item.position_1depth_category
                    ]
                  }
                  -
                  {item.position_2depth_category &&
                    positions2DepthItems[item.position_2depth_category]}
                  {item.amount}명
                </div>
              ))}
            </div>
          </section> */}

          {/* {job?.qualification && (
            <section>
              <h3 className="text-lg font-semibold mb-2">자격요건</h3>
              <div className="whitespace-pre-wrap">{job?.qualification}</div>
            </section>
          )}

          {job?.process && (
            <section className="my-10">
              <h3 className="text-lg font-semibold mb-2">채용절차</h3>
              <div className="whitespace-pre-wrap">{job?.process}</div>
            </section>
          )}

          {job?.working_conditions && (
            <section>
              <h3 className="text-lg font-semibold mb-2">근무조건</h3>
              <div className="whitespace-pre-wrap">
                {job?.working_conditions}
              </div>
            </section>
          )}

          {job?.required_documents && (
            <section className="my-10">
              <h3 className="text-lg font-semibold mb-2">제출서류</h3>
              <div className="whitespace-pre-wrap">
                {job?.required_documents}
              </div>
            </section>
          )}

          {job?.etc && (
            <section>
              <h3 className="text-lg font-semibold mb-2">기타</h3>
              <div className="whitespace-pre-wrap">{job?.etc}</div>
            </section>
          )} */}

          {/* {job?.attachements && (
            <section className="my-10">
              <h3 className="text-lg font-semibold mb-2">첨부파일</h3>
              <div>
                <ul>
                  {(job.attachements as any).map((item: any) => (
                    <li
                      key={item.url}
                      className="flex items-center text-indigo-500"
                    >
                      <ArrowDownTrayIcon
                        className="h-5 w-5 mr-1"
                        aria-hidden="true"
                      />
                      <a
                        href={item.url}
                        download={item.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )} */}

          {/* <div className="border-b border-gray-500" /> */}

          {/* <section className="mt-10 py-6 border-t border-b border-gray-500">
            <div className="flex items-center">
              <div className="mr-4 text-gray-400" style={{ width: 80 }}>
                마감일
              </div>
              <div>
                {job?.duedate
                  ? filters.YYYYMMDD(job.duedate, "YYYY.M.D")
                  : "상시"}
              </div>
            </div>
            <div className="flex items-top mt-2">
              <div className="mr-4 text-gray-400" style={{ width: 80 }}>
                근무지역
              </div>
              <div>
                <div>{job?.address}</div>
                <div className="mt-2 flex">
                  <button
                    className="text-sm mr-4 flex items-center"
                    onClick={openNaverMap}
                  >
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    지도보기
                  </button>
                  <button className="text-sm flex items-center text-lime-300">
                    <DocumentDuplicateIcon className="h-5 w-5 mr-1" />
                    주소복사
                  </button>
                </div>
              </div>
            </div>
          </section> */}

          {/* <section className="my-10">
            <h3 className="text-lg font-semibold mb-2">기관소개</h3>
            <div className="whitespace-pre-wrap">
              {job?.organizations?.desc}
            </div>
          </section> */}
        </div>
        {/* <div className="hidden md:block ml-4 relative" style={{ width: 300 }}>
          <div
            className="border rounded border-gray-500 p-4 flex flex-col items-center justify-center fixed"
            style={{ top: 80, width: 300 }}
          >
            <div
              style={{ width: 50, height: 50 }}
              className="rounded-md bg-gray-300 mr-2 overflow-hidden relative"
            >
              {job?.company_image_url && (
                <Image
                  src={job?.company_image_url}
                  alt="아트인포"
                  fill
                  sizes="50px"
                  style={{ objectFit: "cover" }}
                />
              )}
            </div>
            <div className="text-center mt-2">
              <div className="font-semibold text-lg">
                {job?.organizations?.name}
              </div>
              <div>{positionName}</div>
            </div>

            <button
              className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"

              onClick={moveToApply}
            >
              바로가기
            </button>
          </div>
        </div> */}
      </div>
      {/* <div className="bg-indigo-900 flex md:hidden fixed w-full bottom-0 left-0">
        <div
          className="flex flex-1"
          style={{ paddingBottom: "constant(safe-area-inset-bottom)" }}
        >
          <button className="py-3 px-4 bg-indigo-800">
            <ShareIcon className="h-6 w-6" />
          </button>
          <button
            className="flex-1 transition ease-in-out duration-150 bg-indigo-600 py-3 text-md leading-6 hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            // disabled={
            //   !!job?.duedate &&
            //   (!filters.IS_DATE_FUTURE(job.duedate) ||
            //     filters.IS_DATE_FUTURE(job.start_date))
            // }
            // onClick={moveToApply}
          >
            지원하기
          </button>
        </div>
      </div> */}
      <div className="flex text-white">
        <button
          className="mt-4 transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 mr-2"
          onClick={() => router.back()}
        >
          뒤로가기
        </button>
        <button className="ml-2 mt-4  transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
          바로가기
        </button>
        {job?.link_url && (
          <button className="mt-4  transition ease-in-out duration-150 inline-flex items-center w-full justify-center rounded-md bg-indigo-600 py-3 text-md leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
            바로가기
          </button>
        )}
      </div>
    </div>
  )
}
