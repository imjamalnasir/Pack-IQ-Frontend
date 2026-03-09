import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
//import { Badge } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

import {
Siren,
FileCheck,
ShieldAlert,
Eye,
FileBox,
FileChartColumn,
FileSpreadsheet,


} from "lucide-react"

const recentUploads = [
    {
        uploadId: "UPL-001",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "Packaging",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Completed",
    },
    {
        uploadId: "UPL-002",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "BOM",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Processing",
    },
    {
        uploadId: "UPL-003",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "Sales",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Errors",
    },
    {
        uploadId: "UPL-004",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "Packaging",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Completed",
    },
    {
        uploadId: "UPL-005",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "Packaging",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Errors",
    },
    {
        uploadId: "UPL-006",
        fileName: "Packaging_Specs_Q1_2026.pdf",
        type: "BOM",
        uploadedBy: "John Doe",
        dataTime: "2026-01-01 10:30 AM",
        records: "145",
        status: "Processing",
    },
]

type Props = {
  type: string
}

//export function PackiqRecentUpload({ type }: Props) {
export function PackIQUploadCenterRecentUploads() {

    const uploadType = (type: string) => {
        switch (type) {
            case "Packaging":
                return "bg-green-100 text-green-800 border-green-200"      // green
            case "Sales":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"      // yellow
            case "BOM":
                return "bg-blue-100 text-blue-800 border-blue-200"  // red
            default:
                return "bg-green-100 text-green-800 border-green-200"
        }
    }



        const uploadTypeIcon = (type: string) => {
        switch (type) {
            case "Packaging":
                return FileBox      // icon
            case "Sales":
                return FileChartColumn      // icon
            case "BOM":
                return FileSpreadsheet  // icon
            default:
                return FileBox
        }
    }

    //const UploadTypeIconCom = uploadTypeIcon(type);


    const uploadStatus = (status: string) => {
        switch (status) {
            case "Completed":
                return "default"      // green
            case "Processing":
                return "secondary"      // yellow
            case "Errors":
                return "destructive"  // red
            default:
                return "outline"
        }

    }


    return (
        <Card >
            
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>
            List of recent uploaded files and their status.
          </CardDescription>
        </CardHeader>
        
            <CardContent >
        
        <Table>
            
            <TableHeader>
                <TableRow>
                    
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    
                    <TableHead >Data & Time</TableHead>
                    
                    <TableHead >Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {recentUploads.map((recentUpload) => (
                    <TableRow key={recentUpload.uploadId}>
                        

                        <TableCell>{recentUpload.fileName}</TableCell>
                        <TableCell ><Badge variant="outline" className={uploadType(recentUpload.type)}>{recentUpload.type}</Badge></TableCell>
                        
                        <TableCell >{recentUpload.dataTime}</TableCell>
                        
                        <TableCell ><Badge variant={uploadStatus(recentUpload.status)}>{recentUpload.status}</Badge></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </CardContent>
        </Card>
    )
}
