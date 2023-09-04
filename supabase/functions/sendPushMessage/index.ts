// import { serve } from "https://deno.land/std@0.168.0/http/server"
// // import { serve } from "https://deno.land/std@0.201.0/http/server"

// console.log("Hello from Functions:sendPushMessage")

// serve(async (req: any) => {
//   const payload = await req.json()
//   const { record, type, table } = payload

//   console.log("RECORD: ", record)
//   console.log("TABLE: ", table)

//   if (!record.is_active) {
//     return
//   }

//   const title = `[신규알림] 채용게시판에 새글이 등록되었습니다.`
//   const body = `${record.title}`

//   const pagaName = table
//   const message = {
//     to: "/topics/ALARM-RECRUIT",
//     data: {
//       title,
//       body,
//       clickAction: `https://artinfokorea.com/${pagaName}/${record.id}`,
//     },
//   }

//   const responseData = {
//     success: false,
//     message,
//     fcm_result: null,
//   }

//   const result = await fetch("https://fcm.googleapis.com/fcm/send", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization:
//         "key=AAAA_0Xb19s:APA91bFmcIHPJsxAPauVQZ7AOGtd_pB_nt6dAIjbTfK0jr8JDOOk224fYwQ8wEp5jt4xZZkkEgxUAOg0i1EyHVpEkLnFVBt2VWH2nUUGYWhFMsISP_RObllEdnmwArAYWykAKKs-fzZu",
//     },
//     body: JSON.stringify(message),
//   })
//   if (result.status !== 200) {
//     return new Response(JSON.stringify(responseData), {
//       headers: { "Content-Type": "application/json" },
//     })
//   }

//   const jsonData = await result.json()

//   responseData.success = true
//   responseData.fcm_result = jsonData

//   console.log("RESULT: ", responseData)

//   return new Response(JSON.stringify(responseData), {
//     headers: { "Content-Type": "application/json" },
//   })
// })

// // To invoke:
// // curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
// //   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
// //   --header 'Content-Type: application/json' \
// //   --data '{"name":"Functions"}'
