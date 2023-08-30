import { NextRequest, NextResponse } from "next/server"
import admin from "firebase-admin"
import { initializeApp } from "firebase-admin/app"

import serviceAccount from "../../../../../serviceAccount.json"

initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
})
const fcm = admin.messaging()

export async function POST(request: NextRequest) {
  // const { body } = request
  // console.log(body)
  const body = await request.json()
  if (!body.token) {
    throw new Error("TOKEN_IS_REQUIRED")
  }
  if (body.subscribe === undefined) {
    throw new Error("SUBSCRIBE_IS_REQUIRED")
  }

  // console.log(request.body)
  // console.log(body)

  try {
    if (body.subscribe) {
      const fcmResult = await fcm.subscribeToTopic(
        [body.token],
        "/topics/ALARM-RECRUIT",
      )
      console.log(fcmResult)
      if (fcmResult.errors.length > 0) {
        throw new Error("FAILED_SUBSCRIBE")
      }
    } else {
      const fcmResult = await fcm.unsubscribeFromTopic(
        [body.token],
        "/topics/ALARM-RECRUIT",
      )
      console.log(fcmResult)
      if (fcmResult.errors.length > 0) {
        throw new Error("FAILED_SUBSCRIBE")
      }
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    const error_response = {
      status: "fail",
      message: e.message,
    }
    return new NextResponse(JSON.stringify(error_response), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
