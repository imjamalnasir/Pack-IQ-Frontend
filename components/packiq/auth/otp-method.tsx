

'use client';
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function OtpMethod() {

    const router = useRouter();
  return (
    <Card>
                    <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">OTP Verification Method</h1>
                <p className="text-muted-foreground mx-4">
                  Choose how you’d like to receive your one-time verification code.
                </p>
              </div>

      <CardContent className="">
        <form className="">
    <FieldGroup className="max-wsm">
      <RadioGroup defaultValue="kubernetes">

      <FieldLabel>
        <Field orientation="horizontal">
          <RadioGroupItem value="SMS" id="kubernetes-r2h" />
          
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
          <RadioGroupItem value="Email" id="kubernetes-r2h" />
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
                <Button  type="button" onClick={() => router.push('/enter-otp')}>Send</Button>           
              </Field>
    </FieldGroup>
    </form>
    </CardContent>
    </Card>
  )
}
