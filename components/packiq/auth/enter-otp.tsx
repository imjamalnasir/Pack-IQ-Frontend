"use client"
import { useRouter } from 'next/navigation';

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

type Props = {
  name: string;
};
 
export function EnterOtp(props: any) {
  const router = useRouter();
  return (
    <Card>
                
                <div className="flex flex-col items-center gap-2 text-center">
                <div>{props.otp}</div>
                <h1 className="text-2xl font-bold">Enter verification code</h1>
                <p className="text-muted-foreground text-balance">
                  We sent a 6-digit code
                </p>
              </div>
              <CardContent className="">
                <form className="">
              <FieldGroup className="max-wsm items-center ">
                <div className="py-6">
    <InputOTP  maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
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
                  Enter the 6-digit code received
                </p>
                                    <Field>
                <Button type="button" onClick={() => router.push('/select-client')}>Verify</Button>       
                                    <p className="text-muted-foreground text-balance  text-center">
                  Didn’t receive the code?                   <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >Resend</a>
                </p>    
              </Field>
              </FieldGroup>
              </form>
              </CardContent>
    </Card>
  )
}
