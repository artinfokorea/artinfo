import ListWithAvatar from "./components/ListWithAvatar"

export default function PostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="mx-auto max-w-screen-lg px-4 lg:px-0">
      <div className="flex pt-4">
        <div className="flex-1 overflow-hidden">{children}</div>
        <div className="ml-5 hidden md:block" style={{ width: 300 }}>
          <ListWithAvatar />

          {/* <div className="overflow-x-auto bg-white py-4 px-4 mt-4 drop-shadow-md shawdow-md rounded-lg">
            <h5 className="font-bold mb-2">콘서트</h5>
            <AdContainer />
          </div> */}
        </div>
      </div>
    </div>
  )
}
