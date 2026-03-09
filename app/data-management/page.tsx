import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarPackIQ } from "@/components/app-sidebar-packiq"
import { PackIQDataSpecDashMatrCards } from "@/components/PackIQ-Data-Specialist-Dashboard-MetricCards"
import { PackiqRecentUpload } from "@/components/PackIQ-Recent-Uploads"
import { PackiqTablev1 } from "@/components/packiq-table-v1"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
//import { Button } from "@base-ui/react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"


import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PackIQRadioGroupChoiceCard } from "@/components/PackIQRadioGroupChoiceCard"
import { PackiqFileUploadZone } from "@/components/PackiqFileUploadZone"
import { PackIQUploadCenterRecentUploads } from "@/components/PackIQ-UploadCenter-RecentUploads"
import { PackIQFileUploadProgress } from "@/components/PackIQFileUploadProgress"




export default function DataManagementPage() {
  return (
    <>
  
    <SidebarProvider>
        
        <AppSidebarPackIQ />
      
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Data Management
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>





        
         
           <CardHeader  className="py-4 flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Upload Center
          </CardTitle>
          <CardDescription>
            Upload and process packaging specifications, BOM data, and sales information
          </CardDescription>
          </div>
          <CardAction>
            
          </CardAction>
        </CardHeader>
<Card className="m-6">
 
          
          

<CardContent >
<PackIQRadioGroupChoiceCard />
</CardContent>
<PackiqFileUploadZone />

</Card>

<Card className="m-6">

           <CardHeader  className=" flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
          <CardTitle className="">
          Upload Progress
          </CardTitle>
          <CardDescription>
            Upload and process packaging specifications, BOM data, and sales information
          </CardDescription>
          </div>
          <CardAction>
            
          </CardAction>
        </CardHeader>

<CardContent >
<PackIQFileUploadProgress/>


</CardContent>
</Card>

<CardContent >
          
          <PackIQUploadCenterRecentUploads/> 
</CardContent>


           <CardHeader  className="py-4 flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          Data Specialist Dashboard
          </CardTitle>
          <CardDescription>
            Manage document uploads, data extraction, and validation workflows
          </CardDescription>
          </div>
          <CardAction>
            <Button >Generate Report</Button>
          </CardAction>
        </CardHeader>

  


        <CardContent >
          <PackIQDataSpecDashMatrCards/>
          <PackiqRecentUpload/> 
          </CardContent>
          
        
        
      </SidebarInset>
    </SidebarProvider>
    </>
  )
}
