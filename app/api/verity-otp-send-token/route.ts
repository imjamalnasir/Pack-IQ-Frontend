import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// 🔹 Use a strong secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key"

export async function POST(req: Request) {
  const { otp } = await req.json()

  // 🔹 Replace with real verification logic
  if (otp === "123456") {
    // Create a payload (user info)
    const payload = {
      id: "user123",       // Replace with real user ID
      email: "user@example.com", // Optional
    }

    // Sign JWT (expires in 1 hour)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" })

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      token, // send JWT to frontend
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