"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

export function EnterOtpIntegrated(props: any) {

   const channel = props.channel
   const tempToken = props.tempToken

  const router = useRouter()

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

console.log("temp token : " + tempToken)

  // 🔹 Verify OTP API Call
  const handleVerifyOtp = async (e: any) => {
    e.preventDefault()

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")
    setMessage("")

try {
  const res = await fetch("http://3.235.8.53:8080/auth/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      otp: otp,
      channel: channel,
      tempToken: tempToken,
    }),
  });

  const data = await res.json();

  // ✅ CONDITION 4 - SUCCESS
  if (res.ok && data.status === true) {
    setMessage("OTP verified successfully ✅");

    // You can store tokens if needed
    localStorage.setItem("token", data.Token);
    localStorage.setItem("refreshToken", data.refereshToken);
    console.log(data.Token)
    console.log(data.refereshToken)


    //setTimeout(() => {
      //router.push("/auth/select-client");
    //}, 1000);
  } 
  
  // ❌ ERROR CONDITIONS
  else {
    switch (data.message) {

      // CONDITION 1 - TOKEN EXPIRED
      case "Token expired":
        setError("Session has expired. Please login again.");
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 1500);
        break;

      // CONDITION 2 - INVALID TOKEN
      case "Invalied Token":
        setError("Invalid session. Please login again.");
        setTimeout(() => {
          router.push("/auth/sign-in");
        }, 1500);
        break;

      // CONDITION 3 - OTP EXPIRED
      case "OTP expired":
        setError("OTP has expired. Please request a new OTP.");
        break;

      // DEFAULT (WRONG OTP)
      default:
        setError("Invalid OTP, please enter correct OTP again.");
    }
  }
} catch (err: any) {
  setError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}
  }

  // 🔹 Resend OTP API Call
  const handleResendOtp = async () => {
    try {
      const res = await fetch("/api/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: props.userId,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setMessage("OTP resent successfully ✅")
      } else {
        setError(data.message || "Failed to resend OTP")
      }
    } catch (err) {
      setError("Error resending OTP")
    }
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Enter verification code</h1>
        <p className="text-muted-foreground text-balance">
          We sent a 6-digit code via {props.otpmethod}
        </p>
      </div>

      <CardContent>
        <form onSubmit={handleVerifyOtp}>
          <FieldGroup className="max-wsm items-center">
            <div className="py-6">
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-muted-foreground text-balance">
              Enter the 6-digit code received via {props.otpmethod}
            </p>

            {message && (
              <p className="text-green-600 text-center">{message}</p>
            )}

            {error && (
              <p className="text-red-600 text-center">{error}</p>
            )}

            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>

              <p className="text-muted-foreground text-center mt-3">
                Didn’t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="underline hover:text-primary"
                >
                  Resend
                </button>
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
