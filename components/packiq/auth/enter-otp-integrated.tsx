"use client"

import { useState, useEffect, useRef } from "react"
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

const RESEND_COOLDOWN_SECONDS = 60
const MAX_RESEND_COUNT = 2
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080"

function formatCountdown(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function EnterOtpIntegrated(props: any) {
  const channel = props.channel
  const tempToken = props.tempToken
  const router = useRouter()

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [countdownSeconds, setCountdownSeconds] = useState(RESEND_COOLDOWN_SECONDS)
  const [resendCount, setResendCount] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 1-minute countdown timer (runs on mount and restarts when countdown is reset to 60)
  useEffect(() => {
    if (countdownSeconds <= 0) return
    timerRef.current = setInterval(() => {
      setCountdownSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [countdownSeconds])

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
  const res = await fetch(`${API_URL}/auth/verify-otp`, {
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

    const accessToken = data.token ?? data.Token
    const refresh = data.refreshToken ?? data.refereshToken
    if (accessToken) localStorage.setItem("token", accessToken)
    if (refresh) localStorage.setItem("refreshToken", refresh)

    setTimeout(() => {
      router.push("/auth/select-client");
    }, 800);
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

  // 🔹 Resend OTP – backend API, 1-min cooldown, max 2 resends
  const handleResendOtp = async () => {
    if (resendCount >= MAX_RESEND_COUNT || countdownSeconds > 0) return
    setResendLoading(true)
    setError("")
    setMessage("")
    try {
      const res = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, channel: channel ?? "EMAIL" }),
      })
      const data = await res.json().catch(() => ({}))
      const success = res.ok && (data.valid === true || data.success === true || data.status === true)
      if (success) {
        setMessage("OTP resent successfully ✅")
        setResendCount((c) => c + 1)
        setCountdownSeconds(RESEND_COOLDOWN_SECONDS)
      } else {
        setError(data.message ?? "Failed to resend OTP")
      }
    } catch (err) {
      setError("Error resending OTP")
    } finally {
      setResendLoading(false)
    }
  }

  const resendDisabled = countdownSeconds > 0 || resendCount >= MAX_RESEND_COUNT || resendLoading

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
                {resendCount >= MAX_RESEND_COUNT ? (
                  <span className="text-muted-foreground">Max resends reached (2)</span>
                ) : (
                  <>
                    {countdownSeconds > 0 && (
                      <span className="text-muted-foreground mr-1">
                        Resend in {formatCountdown(countdownSeconds)}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendDisabled}
                      className="underline hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                    >
                      {resendLoading ? "Sending…" : "Resend"}
                    </button>
                  </>
                )}
              </p>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
