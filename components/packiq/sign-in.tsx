import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

/* Alert Diagram imports code by jamal Starts*/

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

/* Alert Diagram imports code by jamal Ends*/

/* Dialog imports code by jamal Starts*/
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* Dialog imports code by jamal Ends*/

export function SignInAll({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Dialog>
      <AlertDialog>


  <AlertDialogTrigger asChild>
    <Button variant="outline">Show Dialog</Button>
  </AlertDialogTrigger>

  <DialogTrigger asChild>
      <Button variant="outline">Open Dialog</Button>
  </DialogTrigger>


      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Acme Inc account
                </p>
              </div>
              <Field>
                             <FieldLabel htmlFor="small-form-role">User Type</FieldLabel>
                  <Select defaultValue="">
                    <SelectTrigger id="small-form-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        
                        <SelectItem value="designer">User</SelectItem>
                        <SelectItem value="manager">Engineer</SelectItem>
                   
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </Field>
              <Field>

                <Button type="submit">Login</Button>
                
              </Field>
             
    
 
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/signin-img.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    

      {/* My Alert code Starts */}


      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Client Selection</AlertDialogTitle>
          <AlertDialogDescription>
            Please review the client details before continuing 
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm & continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    {/* My Alert code Ends */}

    {/* My Dialog code Starts */}

    
  
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Client Selection</DialogTitle>
      <DialogDescription>
        Please review the client details before continuing 
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
  </DialogContent>
</Dialog>
{/* My Dialog code Ends */}

    </div>
  )
}