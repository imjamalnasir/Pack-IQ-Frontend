import { AlertDialogDemo } from "@/components/AlertDialogDemo";
import ChooseClient from "@/components/packiq/auth/choose-client";

export default function SelectClientPage(){

    return(

        <>
        
                   <div className=" flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-6 md:p-10">
             <div className="w-full max-w-sm md:max-w-1xl">
               <ChooseClient />
              
               </div>
               </div>
        
        </>
    )
}