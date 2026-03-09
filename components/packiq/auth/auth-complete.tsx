"use client"

import { useRouter } from 'next/navigation';
import Image from "next/image";

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

export function AuthComplete() {

   const router = useRouter();
  return (
    <Card>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="py-4"><Image
          src="/auth-complete-icon.png"
          alt="Company Logo"
          width={85}
          height={85}
          priority
        /></div>
        <div className="py-6">
                <h1 className="text-2xl font-bold">Authentication Complete!</h1>
                <p className="text-muted-foreground text-balance">
                  You've successfully logged into
                </p>
              </div>
</div>
      <CardContent className="">
        
    <FieldGroup className="max-wsm">

                    <Field>
                <Button  type="button" onClick={() => router.push('#')}  >Go to dashboard</Button>      

                  
              </Field>
    </FieldGroup>
  
    </CardContent>
    </Card>
  )
}
