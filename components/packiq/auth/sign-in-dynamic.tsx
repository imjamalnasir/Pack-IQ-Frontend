
'use client';
import { useRouter } from 'next/navigation';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

export function SignInDynamic({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function testSubmit(){

    alert("hi")
  }


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

  setError("")
  setLoading(true)

    try {
    const res = await fetch("/api/login", {
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

    router.push("/otp-method")

  } catch (err: any) {
     alert("Fail")
    setError(err.message || "Something went wrong")
  } finally {
    setLoading(false)
  }
  }

  
  const router = useRouter();
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
      <Card className="overflow-hidden py-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              
              <Field className='pt-6'>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                 type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field className='pb-6'>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              </Field>
              
              <Field>
                <Button  >Login</Button> 
                 {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}          
              </Field>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/signin-img.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    


    </div>
  )
}