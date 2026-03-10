'use client';

import { EnterOtpGetToken } from '@/components/packiq/auth/enter-otp-get-token';
import { useSearchParams } from 'next/navigation';



   

export default function EnterOtpPage() {

  const searchParams  = useSearchParams();
    
      const method = searchParams.get('method');
      const temptoken = searchParams.get('temptoken');

    console.log(method, temptoken)
    



  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-1xl">
        <EnterOtpGetToken userId={''} otpmethod={''} />
       
      </div>
    </div>
  );
}