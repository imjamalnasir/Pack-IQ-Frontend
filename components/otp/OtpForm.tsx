"use client";

import { useState } from "react";
import { verifyOtp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OtpForm() {
  const [code, setCode] = useState("");

  return (
    <form action={() => verifyOtp(code)} className="space-y-4">
      <Input
        placeholder="Enter 6-digit code"
        onChange={(e) => setCode(e.target.value)}
      />
      <Button className="w-full">Verify</Button>
    </form>
  );
}
