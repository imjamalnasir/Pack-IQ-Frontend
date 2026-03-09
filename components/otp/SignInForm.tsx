"use client";

import { useState } from "react";
import { signInWithEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      action={() => signInWithEmail(email, password)}
      className="space-y-4"
    >
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button className="w-full">Sign in</Button>
    </form>
  );
}
