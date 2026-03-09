"use client"

import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
//import { Button } from "@base-ui/react"
import { Button } from "@/components/ui/button"
import { Card } from "./ui/card"
import {
  FileUp,
} from "lucide-react"

export function PackiqFileUploadZone() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex  mx-12 mb-8 py-12 cursor-pointer items-center justify-center rounded-lg border border-dashed text-sm transition",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-muted-foreground/25"
      )}
    >

      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div><input {...getInputProps()} /></div>
        <div >
          <FileUp  className="size-10"/>

        </div>

        <div className="text-xl">{isDragActive ? "Drop the file here" : "Drag and drop files here"}</div>
        <div>or</div>
        <Button >Browse Files</Button>

        <div>Supported formats: PDF, XLSX, DOCX, CSV
          Maximum file size: 50 MB</div>
      </div>

    </div>
  )
}
