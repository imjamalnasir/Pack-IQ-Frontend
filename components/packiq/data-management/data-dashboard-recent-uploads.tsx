"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080"

/** Shape from GET /documents/recent */
interface RecentDocument {
  id?: string
  originalFileName?: string
  docType?: string
  createdAt?: string
  status?: string
  uploadedBy?: string
  records?: string | number
  [key: string]: unknown
}

function normalizeDocType(type: string | undefined): string {
  if (!type) return "—"
  const t = type.toLowerCase()
  if (t === "spec") return "Packaging"
  if (t === "bom") return "BOM"
  if (t === "sales") return "Sales"
  return type
}

function normalizeStatus(status: string | undefined): string {
  if (!status) return "—"
  const s = status.toLowerCase()
  if (s === "completed" || s === "complete" || s === "done") return "Completed"
  if (s === "processing" || s === "pending" || s === "running") return "Processing"
  if (s === "failed" || s === "error" || s === "errors") return "Errors"
  return status
}

function formatDateTime(value: string | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" })
}

export function DataDashboardRecentUpload() {
  const [items, setItems] = useState<RecentDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    fetch(`${API_URL}/documents/recent`, { credentials: "include", headers })
      .then((res) => {
        if (!res.ok) throw new Error(res.status === 401 ? "Unauthorized" : `Failed to load recent documents (${res.status})`)
        return res.json()
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.documents ?? data?.items ?? []
        setItems(list)
      })
      .catch((err) => setError(err.message ?? "Failed to load recent uploads"))
      .finally(() => setLoading(false))
  }, [])

  const uploadType = (type: string) => {
    const n = normalizeDocType(type).toLowerCase()
    if (n === "packaging" || n === "spec") return "bg-green-100 text-green-800 border-green-200"
    if (n === "sales") return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (n === "bom") return "bg-blue-100 text-blue-800 border-blue-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  const uploadStatus = (status: string) => {
    const n = normalizeStatus(status).toLowerCase()
    if (n === "completed") return "default"
    if (n === "processing") return "secondary"
    if (n === "errors") return "destructive"
    return "outline"
  }

  const getRowId = (row: RecentDocument, i: number) => row.id ?? String(i)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>
          List of recent uploaded files and their status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive mb-2">{error}</p>}
        {loading ? (
          <p className="text-muted-foreground py-4">Loading recent uploads…</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground py-4">No recent uploads.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Upload ID</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((row, i) => (
                <TableRow key={getRowId(row, i)}>
                  <TableCell className="font-medium">{row.id ?? "—"}</TableCell>
                  <TableCell>{row.originalFileName ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={uploadType(row.docType ?? "")}>
                      {normalizeDocType(row.docType)}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.uploadedBy ?? "—"}</TableCell>
                  <TableCell>{formatDateTime(row.createdAt)}</TableCell>
                  <TableCell>{row.records != null ? String(row.records) : "—"}</TableCell>
                  <TableCell>
                    <Badge variant={uploadStatus(row.status ?? "")}>
                      {normalizeStatus(row.status)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
