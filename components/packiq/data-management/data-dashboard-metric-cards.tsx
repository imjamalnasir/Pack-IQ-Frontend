'use client'

import { useEffect, useState } from "react"
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Siren, FileCheck, ShieldAlert, Eye } from "lucide-react"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080"

interface ExtractionStats {
  pending_review?: {
    pending_count?: number
  }
  records_validated?: {
    change_percent_from_last_month?: string
    records_validated?: number
  }
  critical_missing_fields?: {
    details?: unknown[]
    count?: number
  }
  validation_errors?: {
    change_from_yesterday?: string
    validation_errors_count?: number
  }
}

export function DataDashboardMetricCards() {
  const [stats, setStats] = useState<ExtractionStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    const headers: HeadersInit = { "Content-Type": "application/json" }
    if (token) headers["Authorization"] = `Bearer ${token}`

    fetch(`${API_URL}/extractions/stats/all`, {
      credentials: "include",
      headers,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: ExtractionStats | null) => setStats(data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false))
  }, [])

  const criticalCount = stats?.critical_missing_fields?.count ?? 0
  const recordsValidated = stats?.records_validated?.records_validated ?? 0
  const recordsChange = stats?.records_validated?.change_percent_from_last_month ?? "0%"
  const pendingCount = stats?.pending_review?.pending_count ?? 0
  const validationErrors = stats?.validation_errors?.validation_errors_count ?? 0
  const validationChange = stats?.validation_errors?.change_from_yesterday ?? "0"

  const criticalLabel = loading ? "Loading…" : criticalCount.toLocaleString()
  const validatedLabel = loading ? "Loading…" : recordsValidated.toLocaleString()
  const pendingLabel = loading ? "Loading…" : pendingCount.toLocaleString()
  const validationLabel = loading ? "Loading…" : validationErrors.toLocaleString()

  return (
    <div className="grid grid-cols-4 gap-4 py-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Critical Missing Fields</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {criticalLabel}
          </CardTitle>
          <CardAction>
            <Siren className="piqsecondaryColor"  />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Requires immediate attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Records Validated</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {validatedLabel}
          </CardTitle>
          <CardAction>
            <FileCheck className="piqsecondaryColor"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {loading ? "Loading…" : `${recordsChange} from last month`}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Pending Review</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {pendingLabel}
          </CardTitle>
          <CardAction>
<Eye  className="piqsecondaryColor"/>          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Requires attention
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Validation Errors</CardTitle>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {validationLabel}
          </CardTitle>
          <CardAction>
            <ShieldAlert className="piqsecondaryColor"/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {loading ? "Loading…" : `${validationChange} from yesterday`}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
