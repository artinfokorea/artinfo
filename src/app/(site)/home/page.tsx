import Image from "next/image"
import { Suspense } from "react"
import JobContainer from "./components/job/container"
import Loading from "./loading"
import IssueContainer from "./components/issue/IssueContainer"
import AdContainer from "./components/ad/AdContainer"

export default function Home() {
  return (
    <>
      <section className="mb-10">
        <div
          className="w-full overflow-hidden relative"
          style={{ maxHeight: 400 }}
        >
          {/* <Image
            src="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/artinfo2.png"
            alt="아트인포"
            fill
            sizes="(max-width: 1200px) 1200px, 400px"
            style={{ objectFit: "cover" }}
            className="max-w-full max-h-full"
          /> */}
          <Image
            src="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/advertisements/artinfo2.png"
            alt="아트인포"
            layout="responsive"
            sizes="(max-width: 480px) 800px, (max-width: 1200px) 1200px, 400px"
            width={1200}
            height={400}
          />
        </div>
      </section>

      <div className="mx-auto max-w-screen-lg px-4 md:px-0">
        <section className="mb-10">
          <h2 className="text-xl mb-4">주목할 연주 ✨</h2>
          {/* <Loading /> */}
          <Suspense fallback={<Loading />}>
            <AdContainer />
          </Suspense>
        </section>

        <section className="mb-10">
          <h2 className="text-xl mb-4">채용 정보 🚀</h2>
          <Suspense fallback={<Loading />}>
            <JobContainer />
          </Suspense>
        </section>

        <section className="mb-10">
          <h2 className="text-xl">이슈 💬</h2>
          <Suspense fallback={<Loading />}>
            <IssueContainer />
          </Suspense>
        </section>

        <section className="mb-10">
          <h2 className="text-xl">교육 ✏️</h2>
          <ul className="mt-4">
            {Array.from(Array(5)).map((_, idx) => (
              <li
                // eslint-disable-next-line react/no-array-index-key
                key={`test2-${idx}`}
                className="flex border-b border-stone-800 pb-2 mb-4"
              >
                <div className="flex-1 flex items-center">
                  <span className="text-gray-500 mr-2 text-sm">[세미나]</span>
                  [KCRA] 한국합창연구학회 제40차 학술세미나 “에스토니아
                  합창음악”
                </div>
                <span className="text-sm">2023.07.05</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
