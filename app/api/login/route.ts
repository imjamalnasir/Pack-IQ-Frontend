import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { email, password } = await req.json()

  // Replace with DB check
  if (email === "admin@packiq.com" && password === "admin123") {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, message: "Invalid credentials" },
    { status: 401 }
  )
}