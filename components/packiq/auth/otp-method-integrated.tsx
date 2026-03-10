'use client'

import { useState } from 'react'
import { useRouter, useSearchParams  } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ContentListInstance } from 'twilio/lib/rest/content/v2/content'

export function OtpMethodIntegrated(props: any) {
  const router = useRouter()

  const tempToken = props.temptoken
   const email = props.email

  
  const [otpmethod, setOtpmethod] = useState("SMS")
  const [loading, setLoading] = useState(false)
  const channel = otpmethod;


  const handleSend = async () => {
    try {

      setLoading(true)
      const res = await fetch("http://3.235.8.53:8080/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempToken, channel }),
        
      })


      
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      console.log("OTP Response:", data)
    

      // Navigate to enter otp page
      // ⚠️ Do NOT pass OTP in production
     //router.push(`/auth/enter-otp?method=${method}&otp=${data.otp}`)
     
    router.push(`/auth/enter-otp?channel=${channel}&tempToken=${tempToken}&email=${email}`);
  

    } catch (error) {
      console.error("Error sending OTP:", error)
      alert("Failed to send OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex flex-col items-center gap-2 text-center p-6">
        <h1 className="text-2xl font-bold">OTP Verification Method</h1>
        <p className="text-muted-foreground mx-4">
          Choose how you’d like to receive your one-time verification code.
        </p>
      </div>

      <CardContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <FieldGroup className="max-w-sm space-y-6">
            
            <RadioGroup
              value={otpmethod}
              onValueChange={(value) => setOtpmethod(value)}
            >

              <FieldLabel>
                <Field orientation="horizontal">
                  <RadioGroupItem value="SMS" id="sms" />
                  <FieldContent>
                    <FieldTitle>Text Message (SMS)</FieldTitle>
                    <FieldDescription>
                      We’ll send a code to your phone number.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>

              <FieldLabel>
                <Field orientation="horizontal">
                  <RadioGroupItem value="Email" id="email" />
                  <FieldContent>
                    <FieldTitle>Send by Email</FieldTitle>
                    <FieldDescription>
                      We’ll send a code to your email address.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>

            </RadioGroup>

            <Field>
              <Button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Send"}
              </Button>
            </Field>

          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
