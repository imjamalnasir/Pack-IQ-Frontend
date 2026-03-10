'use client';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function SignInDynamicValidated({  
  className,
  ...props
}: React.ComponentProps<"div">) {

  const router = useRouter();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [serverError, setServerError] = useState("")

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const [loading, setLoading] = useState(false)

  /* ---------------- VALIDATION ---------------- */

  const validateEmail = (value: string) => {
    if (!value) return "Email is required"
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regex.test(value)) return "Enter a valid email address"
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) return "Password is required"
    if (value.length < 6) return "Minimum 6 characters required"
    return ""
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (touched.email) {
      setEmailError(validateEmail(value))
    }
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (touched.password) {
      setPasswordError(validatePassword(value))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setServerError("")

    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)

    setEmailError(emailValidation)
    setPasswordError(passwordValidation)

    setTouched({ email: true, password: true })

    if (emailValidation || passwordValidation) return

    setLoading(true)

    try {
      const res = await fetch("http://3.235.8.53:8080/auth/password-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      const temptoken = data.token
      console.log(temptoken)

   
     router.push(`/auth/otp-method?temptoken=${temptoken}`);

    } catch (err: any) {
      setServerError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid =
    !validateEmail(email) &&
    !validatePassword(password)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          {/* FORM */}
          <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>

            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>

              {/* EMAIL */}
              <Field className="pt-6">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, email: true }))
                    setEmailError(validateEmail(email))
                  }}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  aria-invalid={!!emailError}
                  className={cn(
                    emailError && "border-red-400 focus-visible:ring-red-400",
                    !emailError && touched.email && email && "border-green-500 focus-visible:ring-green-500"
                  )}
                />
                {emailError && (
                  <p className="text-sm text-red-500 mt-1">
                    {emailError}
                  </p>
                )}
              </Field>

              {/* PASSWORD */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onBlur={() => {
                    setTouched(prev => ({ ...prev, password: true }))
                    setPasswordError(validatePassword(password))
                  }}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  aria-invalid={!!passwordError}
                  className={cn(
                    passwordError && "border-red-400 focus-visible:ring-red-400",
                    !passwordError && touched.password && password && "border-green-500 focus-visible:ring-green-500"
                  )}
                />
                {passwordError && (
                  <p className="text-sm text-red-500 mt-1">
                    {passwordError}
                  </p>
                )}
              </Field>

              {/* SERVER ERROR */}
              {serverError && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {serverError}
                </div>
              )}

              {/* BUTTON */}
              <Field>
                <Button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full"
                >
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </Field>

            </FieldGroup>
          </form>

          {/* IMAGE SIDE */}
          <div className="bg-muted relative hidden md:block">
            <img
              src="/sign-in-img.png"
              alt="Login visual"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />

          </div>

        </CardContent>
      </Card>
    </div>
  )
}
