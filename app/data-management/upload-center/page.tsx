"use client"

import { useCallback, useState } from "react"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PackIQRadioGroupChoiceCard, type DocType } from "@/components/PackIQRadioGroupChoiceCard"
import { PackiqFileUploadZone } from "@/components/PackiqFileUploadZone"
import { PackIQUploadCenterRecentUploads } from "@/components/PackIQ-UploadCenter-RecentUploads"
import { PackIQFileUploadProgress } from "@/components/PackIQFileUploadProgress"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080"

const UPLOAD_SUCCESS_MESSAGE =
  "Upload is done and processing is in progress. You will be notified by email once processing is done."

export default function UploadCenter() {
  const [docType, setDocType] = useState<DocType>("bom")
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const closeProgress = useCallback(() => {
    setUploadFileName(null)
    setUploadProgress(0)
    setUploadSuccessMessage(null)
    setUploadError(null)
  }, [])

  const onFileAccepted = useCallback(
    async (file: File) => {
      setUploadFileName(file.name)
      setUploadProgress(0)
      setUploadSuccessMessage(null)
      setUploadError(null)
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("doc_type", docType)

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const headers: HeadersInit = {}
      if (token) headers["Authorization"] = `Bearer ${token}`

      try {
        setUploadProgress(30)
        const res = await fetch(`${API_URL}/files/ocr`, {
          method: "POST",
          headers,
          body: formData,
        })
        const data = res.ok ? await res.json().catch(() => ({})) : await res.json().catch(() => ({}))
        if (res.status === 202) {
          setUploadProgress(100)
          setUploadSuccessMessage(UPLOAD_SUCCESS_MESSAGE)
        } else {
          setUploadError(data?.error ?? data?.message ?? `Upload failed (${res.status})`)
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed")
      } finally {
        setUploading(false)
      }
    },
    [docType]
  )

  return (
    <>
    <div className="flex flex-col gap-6">
      <CardHeader className="p-0 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Upload Center
          </CardTitle>
          <CardDescription>
            Upload and process packaging specifications, BOM data, and sales information
          </CardDescription>
        </div>
        <CardAction />
      </CardHeader>

      <Card className="">
        <CardContent>
          <PackIQRadioGroupChoiceCard value={docType} onValueChange={setDocType} />
        </CardContent>
        <PackiqFileUploadZone onFileAccepted={onFileAccepted} disabled={uploading} />
      </Card>

      {uploadFileName != null && (
        <Card className="">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Upload Progress</CardTitle>
              <CardDescription>
                Upload and process packaging specifications, BOM data, and sales information
              </CardDescription>
            </div>
            <CardAction />
          </CardHeader>
          <CardContent>
            {uploadError && (
              <p className="text-sm text-destructive mb-2">{uploadError}</p>
            )}
            <PackIQFileUploadProgress
              fileName={uploadFileName}
              progress={uploadProgress}
              successMessage={uploadSuccessMessage}
              hasError={!!uploadError}
              onClose={closeProgress}
            />
          </CardContent>
        </Card>
      )}

      
        <PackIQUploadCenterRecentUploads />
        
      </div>
    </>
  )
}
