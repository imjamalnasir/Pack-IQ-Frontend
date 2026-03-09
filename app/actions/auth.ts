"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { twilio } from "@/lib/twilio";
import { redirect } from "next/navigation";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function signInWithEmail(
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  const otp = generateOtp();
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  await supabaseAdmin
    .from("profiles")
    .update({
      otp_code: otp,
      otp_expires_at: expires.toISOString(),
    })
    .eq("id", data.user.id);

  // send OTP
  await twilio.messages.create({
    to: data.user.phone!,
    from: process.env.TWILIO_FROM_NUMBER!,
    body: `Your login code is ${otp}`,
  });

  redirect("/auth/otp");
}

export async function verifyOtp(code: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (
    data.otp_code !== code ||
    new Date(data.otp_expires_at) < new Date()
  ) {
    throw new Error("Invalid or expired OTP");
  }

  await supabaseAdmin
    .from("profiles")
    .update({ otp_code: null, otp_expires_at: null })
    .eq("id", user.id);

  redirect("/auth/success");
}
