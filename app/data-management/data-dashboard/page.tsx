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
import { DataDashboardMetricCards } from "@/components/packiq/data-management/data-dashboard-metric-cards"
import { DataDashboardRecentUpload } from "@/components/packiq/data-management/data-dashboard-recent-uploads"




export default function DataDashboard() {
  return (
    <>
  
   
      



           


           <CardHeader  className="p-0 flex flex-row items-start justify-between gap-4">
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

  


        
          
          <DataDashboardMetricCards/>
          <DataDashboardRecentUpload/>
         
          
          
        
        

   
    </>
  )
}
