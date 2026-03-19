import { AppSidebarPackIQ } from "@/components/app-sidebar-packiq";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DataManagmentSideBar } from "@/components/packiq/data-management/data-managment-sidebar";


export default function DataManagementLayout({
  children, // Will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>


    

    <section className="dashboard-wrapper">    
    <SidebarProvider>
        <DataManagmentSideBar />
        
     
        <SidebarInset>
         

              
        <div className="appbg p-6">
          
{children}

</div>
        </SidebarInset>

    </SidebarProvider>

      
    </section>


    </>
  );
}
