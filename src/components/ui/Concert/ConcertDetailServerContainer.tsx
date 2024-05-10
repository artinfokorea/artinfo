import useFilters from "@/hooks/useFilters"
import { PageType } from "@/interface/common"
import SupabaseServer from "@/lib/supabase-server"
import { CONCERT } from "@/types/types"
import { ClockIcon } from "@heroicons/react/20/solid"
import React from "react"
import { deleteConcert } from "@/app/Api"
import CopyClipBoardButton from "../Button/CopyClipBoardButton"
import ConcertDetailClientContainer from "./ConcertDetailClientContainer"
import ConcertForm from "./ConcertForm"
import ConcertDeleteButton from "./ConcertDeleteButton"

interface Props {
  concert: CONCERT
  searchParams?: { [key: string]: PageType }
  pageId: string
}

const adminId = process.env.NEXT_PUBLIC_ADMIN_ID

export const ConcertDetailServerContainer = async ({
  concert,
  searchParams,
  pageId,
}: Props) => {
  const filters = useFilters()
  const pageType = searchParams?.type || PageType.read
  const supabase = SupabaseServer()
  const { data } = await supabase.auth.getSession()
  const userId = data.session?.user.id

  return (
    <div>
      {pageType === PageType.read ? (
        <ConcertDetailClientContainer concert={concert}>
          <div className="sm:container mx-auto mb-20 md:mb-0 ">
            <h2 className="text-2xl font-semi-bold px-2" id="top">
              {concert?.title}
            </h2>

            <div className="flex items-center gap-x-2 my-6 px-2">
              {concert?.authorIconImageUrl && (
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <img
                    src={concert?.authorIconImageUrl}
                    alt="user_image"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-sm">
                <div>{concert?.authorPublicNickName}</div>
                <div className="text-xs">{concert?.authorEmail}</div>
              </div>
            </div>
            <div className="flex border-t border-b border-gray-600 py-3 px-2">
              <div className="flex flex-1 items-center gap-x-4">
                <div className="flex items-center">
                  <ClockIcon className="w-5 mr-1" />
                  <span className="text-sm">
                    {filters.DIFF_FROM_NOW_ADD_TIME(
                      concert?.performanceTime,
                      "YYYY-MM-DD HH:mm",
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                {(concert?.authorId === userId || userId === adminId) && (
                  //   <button className="mr-2">
                  //     <svg
                  //       xmlns="http://www.w3.org/2000/svg"
                  //       fill="none"
                  //       viewBox="0 0 24 24"
                  //       strokeWidth={1.5}
                  //       stroke="currentColor"
                  //       className="w-6 h-6"
                  //     >
                  //       <path
                  //         strokeLinecap="round"
                  //         strokeLinejoin="round"
                  //         d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  //       />
                  //     </svg>
                  //   </button>
                  <a href={`/concerts/${pageId}?type=update`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </a>
                )}
                {(concert?.authorId === userId || userId === adminId) && (
                  <ConcertDeleteButton
                    itemId={concert.id}
                    title="공연 글 삭제"
                  />
                )}

                <CopyClipBoardButton />
              </div>
            </div>

            <section className="mt-10 pb-20">
              {concert?.contents && (
                <div
                  className="w-10/12 mx-auto editor_view"
                  dangerouslySetInnerHTML={{ __html: concert.contents }}
                />
              )}
            </section>
          </div>
        </ConcertDetailClientContainer>
      ) : (
        <ConcertForm type={PageType.update} concert={concert} />
      )}
    </div>
  )
}

export default ConcertDetailServerContainer
