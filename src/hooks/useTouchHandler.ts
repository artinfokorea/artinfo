// "use client"

// import { TouchEvent, useEffect } from "react"

// function useTouchEventHandlers() {
//   let lastTouchEnd = 0
//   const now = new Date().getTime()

//   useEffect(() => {
//     const handleTouchStart = (event: TouchEvent) => {
//       if (event.touches.length > 1) {
//         event.preventDefault()
//       }
//     }

//     const handleTouchEnd = (event: TouchEvent) => {
//       const now = new Date().getTime()
//       if (now - lastTouchEnd <= 300) {
//         event.preventDefault()
//       }
//       lastTouchEnd = now
//     }

//     document.documentElement.addEventListener(
//       "touchstart",
//       function touchStart(event) {
//         handleTouchStart(event) // event 객체를 handleTouchStart 함수로 전달
//       },
//       false,
//     )

//     document.documentElement.addEventListener(
//       "touchend",
//       function touchEnd(event) {
//         handleTouchEnd(event) // event 객체를 handleTouchEnd 함수로 전달
//       },
//       false,
//     )

//     // 컴포넌트가 언마운트될 때 이벤트 핸들러를 제거
//     return () => {
//       document.documentElement.removeEventListener(
//         "touchstart",
//         handleTouchStart,
//         false,
//       )
//       document.documentElement.removeEventListener(
//         "touchend",
//         handleTouchEnd,
//         false,
//       )
//     }
//   }, [])

//   return null // 이 훅은 렌더링 결과를 반환하지 않음
// }

// export default useTouchEventHandlers
