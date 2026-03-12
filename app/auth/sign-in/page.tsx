import { SignIn } from "@/components/packiq/auth/sign-in";
import { SignInDynamic } from "@/components/packiq/auth/sign-in-dynamic";
import { SignInDynamicValidated } from "@/components/packiq/auth/sign-in-dynamic-validated";
import { SignInAll } from "@/components/packiq/sign-in";

export default function SignInPage(){

    return(

        <>

            <div className=" flex min-h-[calc(100vh-200px)]  flex-col items-center justify-center p-0 md:p-0">
      <div className="w-full max-w-sm md:max-w-4xl">

       
        <SignInDynamicValidated/>
        
        
        </div>
        </div>
        </>
    )
}