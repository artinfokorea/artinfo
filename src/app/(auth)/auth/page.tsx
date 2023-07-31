import { Container } from "./Container"

// function classNames(...classes: any) {
//   return classes.filter(Boolean).join(" ")
// }

// function TabItem({ children }: any) {
//   return (
//     <Tab
//       className={({ selected }) =>
//         classNames(
//           "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
//           "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
//           selected
//             ? "bg-white shadow"
//             : "text-blue-100 hover:bg-white/[0.12] hover:text-white",
//         )
//       }
//     >
//       {children}
//     </Tab>
//   )
// }

export default function Auth() {
  return (
    <Container />
    // <div className="sm:mx-auto sm:w-full sm:max-w-sm mt-10 px-8 sm:px-0">
    //   <Tab.Group>
    //     <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
    //       <TabItem>로그인</TabItem>
    //       <TabItem>회원가입</TabItem>
    //     </Tab.List>
    //     <Tab.Panels>
    //       <Tab.Panel>
    //         <Login />
    //       </Tab.Panel>
    //       <Tab.Panel>
    //         <SignUp />
    //       </Tab.Panel>
    //     </Tab.Panels>
    //   </Tab.Group>
    // </div>
  )
}
