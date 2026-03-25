"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field"
import {
  FileSpreadsheet,
  FileBox,
  FileChartColumnIncreasing,
  Pencil,
  Undo2,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DocType = "bom" | "spec" | "sales"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://3.235.8.53:8080"

interface ExtractionListItem {
  extractedId?: string
  bom_id?: string
  [key: string]: unknown
}

interface ComponentRow {
  spec_id?: string
  qty?: string | number | null
  description?: string
  effective_date?: string | null
  cost?: string | number | null
  weight?: string | number | null
  unit_of_measure?: string | null
  [key: string]: unknown
}

interface BomItem {
  bom_id?: string
  product?: string
  components?: ComponentRow[]
  last_revised?: string | null
  effective_date?: string | null
  [key: string]: unknown
}

interface BomsResponse {
  boms?: BomItem[]
}

/** Sales table row (dynamic keys). */
interface SalesRow {
  [key: string]: unknown
}

/** Normalize sales API response into a list of rows for the table. */
function normalizeSalesResponse(data: unknown): { rows: SalesRow[]; summary?: Record<string, unknown> } | null {
  if (data == null) return null
  let rows: unknown[] | null = null
  let summary: Record<string, unknown> | undefined
  if (Array.isArray(data)) {
    rows = data
  } else if (typeof data === "object") {
    const o = data as Record<string, unknown>
    if (Array.isArray(o.sales)) rows = o.sales
    else if (Array.isArray(o.items)) rows = o.items
    else if (Array.isArray(o.records)) rows = o.records
    else if (Array.isArray(o.line_items)) rows = o.line_items
    else if (Array.isArray(o.data)) rows = o.data
    else if (o.data != null && typeof o.data === "object" && Array.isArray((o.data as Record<string, unknown>).sales))
      rows = (o.data as { sales: unknown[] }).sales
    else if (o.sales != null && typeof o.sales === "object" && !Array.isArray(o.sales))
      rows = [o.sales]
    else {
      summary = o
      rows = []
    }
  }
  if (rows == null) return null
  const normalized = rows
    .filter((r): r is Record<string, unknown> => r != null && typeof r === "object")
    .map((r) => ({ ...r } as SalesRow))
  return { rows: normalized, summary }
}

/** Normalize a component row: ensure "name" exists for Spec ID column (API may send spec_id / component_name). */
function normalizeComponentRow(raw: unknown): ComponentRow {
  if (raw == null || typeof raw !== "object") return { name: "" }
  const r = raw as Record<string, unknown>
  const name = r.name ?? r.spec_id ?? r.component_name
  const row: ComponentRow = { ...r, name: name != null ? String(name) : "" }
  return row
}

/** Normalize a single BOM object to our BomItem shape (snake_case, components array). */
function normalizeBomItem(raw: unknown): BomItem | null {
  if (raw == null || typeof raw !== "object") return null
  const r = raw as Record<string, unknown>
  const bomId = r.bom_id ?? r.bomId ?? r.id
  const product = r.product
  const effectiveDate = r.effective_date ?? r.effectiveDate
  const components = Array.isArray(r.components) ? r.components : Array.isArray(r.parts) ? r.parts : []
  const normalizedComponents = components.map(normalizeComponentRow)
  return {
    bom_id: bomId != null ? String(bomId) : undefined,
    product: product != null ? (product as string) : undefined,
    effective_date: effectiveDate != null ? (effectiveDate as string) : undefined,
    components: normalizedComponents,
  }
}

/** Normalize various API response shapes into { boms: BomItem[] }. */
function normalizeBomsResponse(data: unknown): BomsResponse | null {
  if (data == null) return null
  let arr: unknown[] | null = null
  if (Array.isArray(data)) arr = data
  else if (typeof data === "object") {
    const o = data as Record<string, unknown>
    // New API shape: { job_id, packaging: { boms: [...] } }
    const packaging = o.packaging as Record<string, unknown> | undefined
    if (packaging != null && Array.isArray(packaging.boms)) arr = packaging.boms
    else if (Array.isArray(o.boms)) arr = o.boms
    else if (Array.isArray(o.data)) arr = o.data
    else if (o.data != null && typeof o.data === "object" && Array.isArray((o.data as Record<string, unknown>).boms))
      arr = (o.data as { boms: unknown[] }).boms
    else if (o.bom != null && typeof o.bom === "object") arr = [o.bom]
    else if (Array.isArray(o.content)) arr = o.content
    else if (Array.isArray(o.items)) arr = o.items
    // API returns a single BOM object at top level (bom_id, product, components)
    else if (o.bom_id != null || o.product != null || Array.isArray(o.components)) {
      const single = normalizeBomItem(o)
      return single ? { boms: [single] } : null
    }
  }
  if (!arr?.length) return null
  const boms = arr.map(normalizeBomItem).filter((b): b is BomItem => b != null)
  return boms.length ? { boms } : null
}

/** Normalize BOM list API response to ExtractionListItem[] for the dropdown. Handles ids only (string[] or [{ job_id }]) or full objects. */
function normalizeBomListResponse(data: unknown): ExtractionListItem[] {
  if (data == null) return []
  if (Array.isArray(data)) {
    return data.map((item: unknown): ExtractionListItem => {
      if (item == null) return { extractedId: "", bom_id: "" }
      if (typeof item === "string") {
        return { extractedId: item, bom_id: item }
      }
      const r = item as Record<string, unknown>
      const jobId = r.job_id ?? r.extractedId ?? r.id
      const idStr = jobId != null ? String(jobId) : ""
      const pkg = r.packaging as Record<string, unknown> | undefined
      const boms = Array.isArray(pkg?.boms) ? pkg.boms : []
      const first = boms[0] as Record<string, unknown> | undefined
      return {
        extractedId: idStr || undefined,
        bom_id: first?.bom_id != null ? String(first.bom_id) : idStr || undefined,
        product: first?.product != null ? String(first.product) : undefined,
        ...r,
      } as ExtractionListItem
    })
  }
  const o = data as Record<string, unknown>
  const packaging = o.packaging as Record<string, unknown> | undefined
  if (packaging != null && Array.isArray(packaging.boms)) {
    const jobId = o.job_id ?? o.extractedId
    const boms = packaging.boms as Record<string, unknown>[]
    const first = boms[0]
    if (!first) return []
    return [
      {
        extractedId: jobId != null ? String(jobId) : undefined,
        bom_id: first.bom_id != null ? String(first.bom_id) : undefined,
        product: first.product != null ? String(first.product) : undefined,
        ...o,
      },
    ] as ExtractionListItem[]
  }
  if (Array.isArray(o.bom_ids)) {
    return (o.bom_ids as string[]).map((id) => ({ extractedId: id, bom_id: id }))
  }
  if (Array.isArray(o.ids)) return normalizeBomListResponse(o.ids)
  if (Array.isArray(o.job_ids)) return normalizeBomListResponse(o.job_ids)
  const legacy = (o.boms ?? []) as ExtractionListItem[]
  return Array.isArray(legacy) ? legacy : []
}

/** Normalize specs list API response. Handles { spec_ids: [...] } or legacy { specs: [...] } / array. */
function normalizeSpecListResponse(data: unknown): ExtractionListItem[] {
  if (data == null) return []
  const o = data as Record<string, unknown>
  if (Array.isArray(o.spec_ids)) {
    return (o.spec_ids as string[]).map((id) => ({ extractedId: id, bom_id: id }))
  }
  const legacy = (o.specs ?? (Array.isArray(data) ? data : [])) as ExtractionListItem[]
  return Array.isArray(legacy) ? legacy : []
}

/** Normalize sales list API response. Handles { sales_ids: [...] } or legacy { sales: [...] } / array. */
function normalizeSalesListResponse(data: unknown): ExtractionListItem[] {
  if (data == null) return []
  const o = data as Record<string, unknown>
  if (Array.isArray(o.sales_ids)) {
    return (o.sales_ids as string[]).map((id) => ({ extractedId: id, bom_id: id }))
  }
  const legacy = (o.sales ?? (Array.isArray(data) ? data : [])) as ExtractionListItem[]
  return Array.isArray(legacy) ? legacy : []
}

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers: HeadersInit = { "Content-Type": "application/json" }
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

export default function ExtractionReviewPage() {
  const [docType, setDocType] = useState<DocType>("bom")
  const [selectedBom, setSelectedBom] = useState<string>("")
  const [selectedSpec, setSelectedSpec] = useState<string>("")
  const [selectedSales, setSelectedSales] = useState<string>("")

  const [bomList, setBomList] = useState<ExtractionListItem[]>([])
  const [specList, setSpecList] = useState<ExtractionListItem[]>([])
  const [salesList, setSalesList] = useState<ExtractionListItem[]>([])

  const [bomDetail, setBomDetail] = useState<BomsResponse | null>(null)
  const [specDetail, setSpecDetail] = useState<unknown>(null)
  const [salesDetail, setSalesDetail] = useState<unknown>(null)

  const [listsLoading, setListsLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)

  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<ComponentRow | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const originalRowRef = useRef<ComponentRow | null>(null)

  const [salesRowsState, setSalesRowsState] = useState<SalesRow[]>([])
  const [editingSalesRowIndex, setEditingSalesRowIndex] = useState<number | null>(null)
  const [salesEditDraft, setSalesEditDraft] = useState<SalesRow | null>(null)
  const [salesSaveLoading, setSalesSaveLoading] = useState(false)
  const [salesSaveError, setSalesSaveError] = useState<string | null>(null)
  const originalSalesRowRef = useRef<SalesRow | null>(null)

  // Fetch extraction lists on mount (BOM list may be { boms: [...] } or array of { job_id, packaging: { boms } })
  useEffect(() => {
    const headers = getAuthHeaders()
    Promise.all([
      fetch(`${API_URL}/extractions/boms`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_URL}/extractions/specs`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_URL}/extractions/sales`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([bomsData, specsData, salesData]) => {
        const bomsArr = normalizeBomListResponse(bomsData)
        const specsArr = normalizeSpecListResponse(specsData)
        const salesArr = normalizeSalesListResponse(salesData)
        setBomList(bomsArr)
        setSpecList(specsArr)
        setSalesList(salesArr)
      })
      .catch(() => {})
      .finally(() => setListsLoading(false))
  }, [])

  // Fetch BOM detail when selected (response may be { boms: [...] } or array or { data: [...] } etc.)
  useEffect(() => {
    if (!selectedBom) {
      setBomDetail(null)
      setEditingRowIndex(null)
      setEditDraft(null)
      return
    }
    setDetailLoading(true)
    fetch(`${API_URL}/extractions/boms/${selectedBom}`, { credentials: "include", headers: getAuthHeaders() })
      .then(async (r) => {
        const data = await r.json().catch(() => null)
        if (!r.ok) return null
        return normalizeBomsResponse(data)
      })
      .then(setBomDetail)
      .catch(() => setBomDetail(null))
      .finally(() => setDetailLoading(false))
  }, [selectedBom])

  // Fetch Spec detail when selected
  useEffect(() => {
    if (!selectedSpec) {
      setSpecDetail(null)
      return
    }
    setDetailLoading(true)
    fetch(`${API_URL}/extractions/specs/${selectedSpec}`, { credentials: "include", headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then(setSpecDetail)
      .catch(() => setSpecDetail(null))
      .finally(() => setDetailLoading(false))
  }, [selectedSpec])

  // Fetch Sales detail when selected
  useEffect(() => {
    if (!selectedSales) {
      setSalesDetail(null)
      setSalesRowsState([])
      setEditingSalesRowIndex(null)
      setSalesEditDraft(null)
      return
    }
    setDetailLoading(true)
    fetch(`${API_URL}/extractions/sales/${selectedSales}`, { credentials: "include", headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then(setSalesDetail)
      .catch(() => setSalesDetail(null))
      .finally(() => setDetailLoading(false))
  }, [selectedSales])

  // Sync editable sales rows from API response
  useEffect(() => {
    const norm = normalizeSalesResponse(salesDetail)
    const rows = norm?.rows ?? []
    setSalesRowsState(rows)
    setEditingSalesRowIndex(null)
    setSalesEditDraft(null)
    originalSalesRowRef.current = null
  }, [salesDetail])

  const bom = bomDetail?.boms?.[0] ?? null
  const bomDetailDisplay = bom
    ? {
        bomId: bom.bom_id ?? "—",
        product: (bom.product as string) ?? "—",
      }
    : null

  const componentsRows: ComponentRow[] = bom?.components ?? []
  const bomEffectiveDate = bom?.effective_date ?? null

  const normalizedSales = normalizeSalesResponse(salesDetail)
  const salesSummary = normalizedSales?.summary
  const salesRows: SalesRow[] = salesRowsState
  const salesDataKeys = (() => {
    const keySet = new Set<string>()
    for (const row of salesRows) {
      if (row && typeof row === "object") {
        for (const [k, v] of Object.entries(row)) {
          if (v != null && v !== "") keySet.add(k)
        }
      }
    }
    const sorted = Array.from(keySet).sort()
    if (sorted.includes("sku")) return ["sku", ...sorted.filter((k) => k !== "sku")]
    return sorted
  })()
  const getSalesCellValue = (row: SalesRow, key: string): string => {
    if (!row) return "—"
    const v = row[key]
    return v != null && v !== "" ? String(v) : "—"
  }
  const salesFirstColumnKey = salesDataKeys[0] ?? ""

  const startEditingSales = (index: number) => {
    const row = salesRows[index]
    if (!row) return
    const copy = { ...row }
    originalSalesRowRef.current = copy
    setSalesEditDraft(copy)
    setEditingSalesRowIndex(index)
  }
  const saveSalesEdit = () => {
    if (editingSalesRowIndex == null || salesEditDraft == null) return
    setSalesRowsState((prev) => {
      const next = [...prev]
      next[editingSalesRowIndex] = { ...salesEditDraft }
      return next
    })
    setEditingSalesRowIndex(null)
    setSalesEditDraft(null)
    originalSalesRowRef.current = null
  }
  const undoSalesEdit = () => {
    if (originalSalesRowRef.current) setSalesEditDraft({ ...originalSalesRowRef.current })
  }
  const updateSalesDraft = (field: string, value: string | number | null) => {
    if (salesEditDraft) setSalesEditDraft({ ...salesEditDraft, [field]: value })
  }
  const saveSalesToBackend = () => {
    if (!selectedSales) return
    setSalesSaveError(null)
    setSalesSaveLoading(true)
    fetch(`${API_URL}/extractions/sales/${selectedSales}/edit`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({ sales: salesRowsState }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || "Save failed")
      })
      .catch((err) => setSalesSaveError(err instanceof Error ? err.message : "Save failed"))
      .finally(() => setSalesSaveLoading(false))
  }

  // Collect all keys that have a non-null value in at least one component (excluding "name" which is shown as Spec ID)
  const componentDataKeys = (() => {
    const keySet = new Set<string>()
    for (const comp of componentsRows) {
      if (comp && typeof comp === "object") {
        for (const [k, v] of Object.entries(comp)) {
          if (k !== "name" && k !== "spec_id" && v != null && v !== "") keySet.add(k)
        }
      }
    }
    return Array.from(keySet).sort()
  })()

  const formatHeader = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  const getDynamicCellValue = (row: ComponentRow, key: string): string => {
    if (!row) return "—"
    const v = key === "name" ? row.name : row[key]
    return v != null && v !== "" ? String(v) : "—"
  }

  const getSpecIdDisplay = (row: ComponentRow): string => {
    if (!row) return "—"
    const name = row.name
    return name != null && name !== "" ? String(name) : "—"
  }

  const startEditing = (index: number) => {
    const row = componentsRows[index]
    if (!row) return
    const copy = { ...row }
    originalRowRef.current = copy
    setEditDraft(copy)
    setEditingRowIndex(index)
  }

  const saveEdit = () => {
    if (editingRowIndex == null || editDraft == null || !bomDetail?.boms?.[0]) return
    const nextBoms = [...(bomDetail.boms ?? [])]
    const bom = { ...nextBoms[0], components: [...(nextBoms[0].components ?? [])] }
    bom.components[editingRowIndex] = { ...editDraft }
    nextBoms[0] = bom
    setBomDetail({ ...bomDetail, boms: nextBoms })
    setEditingRowIndex(null)
    setEditDraft(null)
    originalRowRef.current = null
  }

  const undoEdit = () => {
    if (originalRowRef.current) setEditDraft({ ...originalRowRef.current })
  }

  const updateDraft = (field: string, value: string | number | null) => {
    if (editDraft) setEditDraft({ ...editDraft, [field]: value })
  }

  const saveToBackend = () => {
    const jobId = selectedBom
    const packaging = bom ?? null
    if (!jobId || !packaging) return
    setSaveError(null)
    setSaveLoading(true)
    fetch(`${API_URL}/extractions/${docType}/${jobId}/edit`, {
      method: "POST",
      credentials: "include",
      headers: getAuthHeaders(),
      body: JSON.stringify({ packaging }),
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText || "Save failed")
      })
      .catch((err) => setSaveError(err instanceof Error ? err.message : "Save failed"))
      .finally(() => setSaveLoading(false))
  }

  return (
    <>
    
      <CardHeader className="py-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Extraction Review
          </CardTitle>
          <CardDescription>
            Review and validate extracted data from uploaded documents
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild>
            <Link href="/data-management/upload-center" className="no-underline font-normal">
              Upload New
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      {/* Document type selection cards */}
      
      <div className="py-0 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
        
        <Card
          className={cn(
            "transition-colors cursor-pointer flex flex-col h-full",
            docType === "bom" && "ring-2 ring-primary border-primary"
          )}
          onClick={() => setDocType("bom")}
        >
          <CardContent className="pt-0 flex flex-col flex-1">
            <Field className="flex flex-col flex-1">
              <FieldContent className="gap-2">
                <FileSpreadsheet className="size-8 shrink-0 text-muted-foreground" />
                <FieldTitle>BOM Only</FieldTitle>
                <FieldDescription className="line-clamp-2">
                  Bill of Materials data including component weights and materials
                </FieldDescription>
              </FieldContent>
              <div className="mt-0 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Select value={selectedBom || undefined} onValueChange={setSelectedBom} disabled={listsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bomList
                      .filter((item) => (item.extractedId ?? item.bom_id ?? "") !== "")
                      .map((item) => {
                        const value = String(item.extractedId ?? item.bom_id)
                        const label = String(item.bom_id ?? item.product ?? item.extractedId ?? value)
                        return (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "transition-colors cursor-pointer flex flex-col h-full",
            docType === "spec" && "ring-2 ring-primary border-primary"
          )}
          onClick={() => setDocType("spec")}
        >
          <CardContent className="pt-0 flex flex-col flex-1">
            <Field className="flex flex-col flex-1">

              
              <FieldContent className="gap-2 min-h-[5rem]">
                <FileBox  />
                <FieldTitle>Spec Only</FieldTitle>
                <FieldDescription className="line-clamp-2">
                  Essential technical specification details.
                </FieldDescription>
              </FieldContent>
              <div className="mt-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Select value={selectedSpec || undefined} onValueChange={setSelectedSpec} disabled={listsLoading || docType !== "spec"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {specList
                      .filter((item) => ((item.extractedId ?? item.bom_id) ?? "") !== "")
                      .map((item) => {
                        const value = String(item.extractedId ?? item.bom_id)
                        return (
                          <SelectItem key={value} value={value}>
                            {item.extractedId ?? item.bom_id ?? value}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "transition-colors cursor-pointer flex flex-col h-full",
            docType === "sales" && "ring-2 ring-primary border-primary"
          )}
          onClick={() => setDocType("sales")}
        >
          <CardContent className="pt-0 flex flex-col flex-1">
            <Field className="flex flex-col flex-1">
              <FieldContent className="gap-2 min-h-[5rem]">
                <FileChartColumnIncreasing  />
                <FieldTitle>Sales</FieldTitle>
                <FieldDescription className="line-clamp-2">
                  Extract sales data for EPR compliance reporting
                </FieldDescription>
              </FieldContent>
              <div className="mt-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Select value={selectedSales || undefined} onValueChange={setSelectedSales} disabled={listsLoading || docType !== "sales"}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesList
                      .filter((item) => (item.extractedId ?? item.bom_id ?? "") !== "")
                      .map((item) => {
                        const value = String(item.extractedId ?? item.bom_id)
                        return (
                          <SelectItem key={value} value={value}>
                            {item.extractedId ?? item.bom_id ?? value}
                          </SelectItem>
                        )
                      })}
                  </SelectContent>
                </Select>
              </div>
            </Field>
          </CardContent>
        </Card>
      </div>
      

      {/* BOM Details card - show when BOM selected */}
      {docType === "bom" && selectedBom && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>BOM Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {detailLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : bomDetailDisplay ? (
              <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                <div>
                  <dt className="font-medium text-muted-foreground">BOM ID</dt>
                  <dd>{bomDetailDisplay.bomId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-muted-foreground">Product</dt>
                  <dd>{bomDetailDisplay.product}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-muted-foreground text-sm">No details available.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Components table - show when BOM selected */}
      {docType === "bom" && selectedBom && (
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              (inactive or excluded are greyed out)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <p className="text-muted-foreground text-sm py-4">Loading…</p>
            ) : componentsRows.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No components.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Spec ID</TableHead>
                    {componentDataKeys.map((key) => (
                      <TableHead key={key}>{formatHeader(key)}</TableHead>
                    ))}
                    <TableHead className="w-[120px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentsRows.map((row, i) => {
                    const isEditing = editingRowIndex === i
                    const displayRow = isEditing && editDraft ? editDraft : row
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{getSpecIdDisplay(displayRow)}</TableCell>
                        {isEditing ? (
                          <>
                            {componentDataKeys.map((key) => (
                              <TableCell key={key}>
                                <Input
                                  value={String(displayRow[key] ?? "")}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    updateDraft(key, val === "" ? null : Number(val) || val)
                                  }}
                                  className="h-8 w-full min-w-0"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button type="button" size="sm" variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" onClick={saveEdit}>
                                  Done
                                </Button>
                                <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={undoEdit} aria-label="Undo">
                                  <Undo2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {componentDataKeys.map((key) => (
                              <TableCell key={key}>{getDynamicCellValue(displayRow, key)}</TableCell>
                            ))}
                            <TableCell className="text-right">
                              <Button type="button" size="icon" variant="default" className="h-8 w-8 shrink-0" onClick={() => startEditing(i)} aria-label="Edit row">
                                <Pencil className="size-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
            {!detailLoading && componentsRows.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <Button type="button" onClick={saveToBackend} disabled={saveLoading}>
                  {saveLoading ? "Saving…" : "Save"}
                </Button>
                {saveError && <p className="text-sm text-destructive">{saveError}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Spec detail - show when Spec selected and has selection */}
      {docType === "spec" && selectedSpec && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Spec Details</CardTitle>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : (() => {
              const specObj =
                specDetail != null && typeof specDetail === "object" && !Array.isArray(specDetail)
                  ? (specDetail as Record<string, unknown>)
                  : Array.isArray(specDetail) && specDetail.length > 0
                    ? ((specDetail[0] as Record<string, unknown>) ?? {})
                    : null
              if (!specObj) {
                return specDetail != null ? <p className="text-sm">{String(specDetail)}</p> : <p className="text-muted-foreground text-sm">No details available.</p>
              }
              const entries = Object.entries(specObj).filter(
                ([, value]) => value != null && value !== ""
              )
              if (entries.length === 0) {
                return <p className="text-muted-foreground text-sm">No details available.</p>
              }
              const mid = Math.ceil(entries.length / 2)
              const leftCol = entries.slice(0, mid)
              const rightCol = entries.slice(mid)
              const renderValue = (value: unknown) =>
                value == null || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value)
              return (
                <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                  <div className="space-y-4">
                    {leftCol.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <span className="font-semibold text-foreground">{formatHeader(key)}</span>
                        <span className="text-muted-foreground text-right">{renderValue(value)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {rightCol.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <span className="font-semibold text-foreground">{formatHeader(key)}</span>
                        <span className="text-muted-foreground text-right">{renderValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Sales Details card - show when Sales selected, two-column label-value like Spec Details */}
      {docType === "sales" && selectedSales && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sales Details</CardTitle>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : (() => {
              const summary = salesSummary && typeof salesSummary === "object" && !Array.isArray(salesSummary) ? salesSummary as Record<string, unknown> : null
              const entries = summary ? Object.entries(summary).filter(([, v]) => v != null && v !== "") : []
              if (entries.length === 0) {
                return salesRows.length > 0 ? (
                  <p className="text-muted-foreground text-sm">See table below for records.</p>
                ) : (
                  <p className="text-muted-foreground text-sm">No details available.</p>
                )
              }
              const mid = Math.ceil(entries.length / 2)
              const leftCol = entries.slice(0, mid)
              const rightCol = entries.slice(mid)
              const renderValue = (value: unknown) =>
                value == null || value === "" ? "—" : typeof value === "object" ? JSON.stringify(value) : String(value)
              return (
                <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                  <div className="space-y-4">
                    {leftCol.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <span className="font-semibold text-foreground">{formatHeader(key)}</span>
                        <span className="text-muted-foreground text-right">{renderValue(value)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    {rightCol.map(([key, value]) => (
                      <div key={key} className="flex justify-between gap-4">
                        <span className="font-semibold text-foreground">{formatHeader(key)}</span>
                        <span className="text-muted-foreground text-right">{renderValue(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Sales table - show when Sales selected, same structure as BOM with editing */}
      {docType === "sales" && selectedSales && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Data</CardTitle>
            <CardDescription>
              Line items and sales records from the extracted document
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <p className="text-muted-foreground text-sm py-4">Loading…</p>
            ) : salesRows.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">No sales records.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {salesDataKeys.map((key) => (
                      <TableHead key={key}>{formatHeader(key)}</TableHead>
                    ))}
                    <TableHead className="w-[120px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesRows.map((row, i) => {
                    const isEditing = editingSalesRowIndex === i
                    const displayRow = isEditing && salesEditDraft ? salesEditDraft : row
                    return (
                      <TableRow key={i}>
                        {isEditing ? (
                          <>
                            {salesDataKeys.map((key) => (
                              <TableCell key={key}>
                                <Input
                                  value={String(displayRow[key] ?? "")}
                                  onChange={(e) => {
                                    const val = e.target.value
                                    updateSalesDraft(key, val === "" ? null : Number(val) || val)
                                  }}
                                  className="h-8 w-full min-w-0"
                                />
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button type="button" size="sm" variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200" onClick={saveSalesEdit}>
                                  Done
                                </Button>
                                <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={undoSalesEdit} aria-label="Undo">
                                  <Undo2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            {salesDataKeys.map((key) => (
                              <TableCell key={key} className={key === salesFirstColumnKey ? "font-medium" : ""}>
                                {getSalesCellValue(displayRow, key)}
                              </TableCell>
                            ))}
                            <TableCell className="text-right">
                              <Button type="button" size="icon" variant="default" className="h-8 w-8 shrink-0" onClick={() => startEditingSales(i)} aria-label="Edit row">
                                <Pencil className="size-4" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
            {!detailLoading && salesRows.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <Button type="button" onClick={saveSalesToBackend} disabled={salesSaveLoading}>
                  {salesSaveLoading ? "Saving…" : "Save"}
                </Button>
                {salesSaveError && <p className="text-sm text-destructive">{salesSaveError}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Placeholder when Spec or Sales selected but no value in dropdown */}
      {(docType === "spec" && !selectedSpec) && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a document from the Spec Only card to view details.
          </CardContent>
        </Card>
      )}
      {(docType === "sales" && !selectedSales) && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Select a document from the Sales card to view details.
          </CardContent>
        </Card>
      )}
    </>
  )
}
