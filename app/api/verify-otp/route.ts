import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { otp } = await req.json()

  // 🔹 Replace with real verification logic
  if (otp === "123456") {
    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    })
  }

  return NextResponse.json(
    {
      success: false,
      message: "Invalid OTP",
    },
    { status: 400 }
  )
}
