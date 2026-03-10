'use client';


import { EnterOtpGetToken } from '@/components/packiq/auth/enter-otp-get-token';
import { EnterOtpIntegrated } from '@/components/packiq/auth/enter-otp-integrated';
import { useSearchParams } from 'next/navigation';



   

export default function EnterOtpPage() {

  const searchParams  = useSearchParams();
    
      const channel = searchParams.get('channel');
      const tempToken = searchParams.get('tempToken');





  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-1xl">
        <EnterOtpIntegrated channel={channel} tempToken={tempToken} />
       
       
      </div>
    </div>
  );
}