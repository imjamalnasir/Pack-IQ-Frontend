"use client"
import { useRouter } from 'next/navigation';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import Image from "next/image";

export default function ChooseClient(){

    const router = useRouter();
        return(

            <>
            <Dialog>
            <Card>
               <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Choose the client</h1>
                <p className="text-muted-foreground text-balance">
                  Choose the client you want to access
                </p>
              </div>

                            <CardContent className="">
                <form className="">
              <FieldGroup className="max-wsm">

            
            
            

              <Field className="py-10">
                             <FieldLabel htmlFor="small-form-role">Select Client</FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="small-form-role">
                      <SelectValue placeholder="Please select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>                  
                        <SelectItem value="designer">Hain Celestial</SelectItem>
                        <SelectItem value="manager">Marathon Foods</SelectItem>   
                         <SelectItem value="pepsico">Pepsico</SelectItem>     
                         <SelectItem value="Pearsons">Pearson's</SelectItem>    
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </Field>
                  <DialogTrigger asChild>
                  
        
                  <Button  >Continue</Button>  
                  </DialogTrigger>
                  </FieldGroup>
                  </form>
                  </CardContent>

                  </Card>





     <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Client Selection</DialogTitle>
      <DialogDescription>
        Please review the client details before continuing  
      </DialogDescription>
    </DialogHeader>
<Card className="flex align-top ">
  <div className="flex px-4 gap-8 align-top">
  <div className="w-1/4 p-0 align-top" >
  
 

<Image
          src="/client-logo-hain-celestial.png"
          alt="Company Logo"
          width={206}
          height={64}
          priority
        />
  
  </div>
  <div className="w-3/4  p-0 align-top ">
    <h3 className="text-lg font-bold py-4">Hain Celestial</h3>
    <div>
          <div className="font-bold">Industry:</div>
          <div>Food and beverage</div>

    </div>
        <div className="pt-2">
          <div className="font-bold">Location:</div>
          <div>New Jersey, United States</div>

    </div>
  </div>

</div>
</Card>
    <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button  type="button" onClick={() => router.push('/auth/auth-complete')} >Confirm & continue</Button>
          </DialogFooter>
  </DialogContent>
</Dialog>

            </>
        )
}