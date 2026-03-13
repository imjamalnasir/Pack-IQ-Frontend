'use client'

import { Suspense } from 'react'
import { EnterOtpIntegrated } from '@/components/packiq/auth/enter-otp-integrated'
import { useSearchParams } from 'next/navigation'

function EnterOtpContent() {
  const searchParams = useSearchParams()
  const channel = searchParams.get('channel')
  const tempToken = searchParams.get('tempToken')

  return (
    <div className="w-full max-w-md md:max-w-1xl">
      <EnterOtpIntegrated channel={channel} tempToken={tempToken} />
    </div>
  )
}

export default function EnterOtpPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center p-6 md:p-10">
      <Suspense fallback={<div /*className="w-full max-w-sm md:max-w-1xl animate-pulse rounded-lg bg-muted/50 h-64"*/ />}>
        <EnterOtpContent />
      </Suspense>
    </div>
  )
}