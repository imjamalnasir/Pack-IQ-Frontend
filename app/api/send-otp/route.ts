import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { method } = await req.json()

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  console.log(`Generated OTP for ${method}: ${otp}`)

  // Later you will:
  // - Save OTP in DB / Redis
  // - Send SMS or Email

  return NextResponse.json({
    success: true,
    message: `OTP sent via ${method}`,
    // ⚠️ remove this in production
    otp,
  })
}
