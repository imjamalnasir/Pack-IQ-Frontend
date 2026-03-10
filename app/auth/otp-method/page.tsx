'use client'
import { OtpMethod } from "@/components/packiq/auth/otp-method";
import { OtpMethodIntegrated } from "@/components/packiq/auth/otp-method-integrated";
import { useSearchParams  } from 'next/navigation'

export default function OtpMethodPage(){

      const searchParams  = useSearchParams();
    
      const temptoken = searchParams.get('temptoken');
     
    
     

    return(

        <>
        
                <div className=" flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-sm md:max-w-1xl">
                      {/*<OtpMethod/>*/}
                      <OtpMethodIntegrated temptoken={temptoken}/>
                      </div>
                      </div>
        
        </>
    )
}