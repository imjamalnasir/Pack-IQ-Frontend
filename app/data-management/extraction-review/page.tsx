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
  const originalRowRef = useRef<ComponentRow | null>(null)

  // Fetch extraction lists on mount (BOM list returns { boms: [...] })
  useEffect(() => {
    const headers = getAuthHeaders()
    Promise.all([
      fetch(`${API_URL}/extractions/boms`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_URL}/extractions/specs`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
      fetch(`${API_URL}/extractions/sales`, { credentials: "include", headers }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([bomsData, specsData, salesData]) => {
        const bomsArr = (bomsData?.boms ?? (Array.isArray(bomsData) ? bomsData : [])) as ExtractionListItem[]
        const specsArr = (specsData?.specs ?? (Array.isArray(specsData) ? specsData : [])) as ExtractionListItem[]
        const salesArr = (salesData?.sales ?? (Array.isArray(salesData) ? salesData : [])) as ExtractionListItem[]
        setBomList(bomsArr)
        setSpecList(specsArr)
        setSalesList(salesArr)
      })
      .catch(() => {})
      .finally(() => setListsLoading(false))
  }, [])

  // Fetch BOM detail when selected (response: { boms: [ { bom_id, product, components, ... } ] })
  useEffect(() => {
    if (!selectedBom) {
      setBomDetail(null)
      setEditingRowIndex(null)
      setEditDraft(null)
      return
    }
    setDetailLoading(true)
    fetch(`${API_URL}/extractions/boms/${selectedBom}`, { credentials: "include", headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: BomsResponse | null) => setBomDetail(data))
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
      return
    }
    setDetailLoading(true)
    fetch(`${API_URL}/extractions/sales/${selectedSales}`, { credentials: "include", headers: getAuthHeaders() })
      .then((r) => (r.ok ? r.json() : null))
      .then(setSalesDetail)
      .catch(() => setSalesDetail(null))
      .finally(() => setDetailLoading(false))
  }, [selectedSales])

  const bom = bomDetail?.boms?.[0] ?? null
  const bomDetailDisplay = bom
    ? {
        bomId: bom.bom_id ?? "—",
        product: (bom.product as string) ?? "—",
      }
    : null

  const componentsRows: ComponentRow[] = bom?.components ?? []
  const bomEffectiveDate = bom?.effective_date ?? null

  const getComponentCell = (row: ComponentRow, key: "specId" | "qty" | "description" | "effectiveDate") => {
    if (!row) return "—"
    if (key === "effectiveDate") return row.effective_date != null ? String(row.effective_date) : (bomEffectiveDate != null ? String(bomEffectiveDate) : "—")
    const map: Record<string, string> = {
      specId: String(row.spec_id ?? ""),
      qty: String(row.qty ?? ""),
      description: String(row.description ?? ""),
    }
    return map[key] ?? "—"
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

  const updateDraft = (field: keyof ComponentRow, value: string | number | null) => {
    if (editDraft) setEditDraft({ ...editDraft, [field]: value })
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
      
      <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 items-stretch">
        
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
              <FileSpreadsheet />
              <FieldTitle>BOM Only</FieldTitle>
              <FieldDescription>
                Bill of Materials data including component weights and materials
              </FieldDescription>
            </FieldContent>

             

              <div className="mt-0 shrink-0" onClick={(e) => e.stopPropagation()}>
                <Select value={selectedBom || undefined} onValueChange={setSelectedBom} disabled={listsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {bomList.map((item) => {
                      const value = String(item.bom_id ?? item.extractedId ?? "")
                      const label = String((item.bom_id ?? item.product ?? item.extractedId ?? value) || "—")
                      return (
                        <SelectItem key={value ? value : `bom-${String(item.product ?? "row")}`} value={value}>
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
                <Select value={selectedSpec || undefined} onValueChange={setSelectedSpec} disabled={listsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {specList.map((item) => (
                      <SelectItem key={item.extractedId ?? item.bom_id ?? ""} value={(item.extractedId ?? item.bom_id) ?? ""}>
                        {item.extractedId ?? item.bom_id ?? ""}
                      </SelectItem>
                    ))}
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
                <Select value={selectedSales || undefined} onValueChange={setSelectedSales} disabled={listsLoading}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesList.map((item) => {
                      const val = (item.extractedId ?? item.bom_id) ?? ""
                      return (
                        <SelectItem key={val ? val : "sales-row"} value={val}>
                          {(item.extractedId ?? item.bom_id ?? val) || "—"}
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
                    <TableHead>Qty</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Effective date</TableHead>
                    <TableHead className="w-[120px] text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {componentsRows.map((row, i) => {
                    const isEditing = editingRowIndex === i
                    const displayRow = isEditing && editDraft ? editDraft : row
                    return (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{getComponentCell(displayRow, "specId")}</TableCell>
                        {isEditing ? (
                          <>
                            <TableCell>
                              <Input
                                value={String(displayRow.qty ?? "")}
                                onChange={(e) => updateDraft("qty", e.target.value === "" ? null : Number(e.target.value) || e.target.value)}
                                className="h-8 w-full min-w-[4rem]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={String(displayRow.description ?? "")}
                                onChange={(e) => updateDraft("description", e.target.value)}
                                className="h-8 w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={displayRow.effective_date != null ? String(displayRow.effective_date) : (bomEffectiveDate != null ? String(bomEffectiveDate) : "")}
                                onChange={(e) => updateDraft("effective_date", e.target.value || null)}
                                className="h-8 w-full"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button type="button" size="sm" variant="outline" className="bg-yellow-500 text-white border-yellow-200 hover:bg-yellow-200" onClick={saveEdit}>
                                  Save
                                </Button>
                                <Button type="button" size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={undoEdit} aria-label="Undo">
                                  <Undo2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>{getComponentCell(displayRow, "qty")}</TableCell>
                            <TableCell>{getComponentCell(displayRow, "description")}</TableCell>
                            <TableCell>{getComponentCell(displayRow, "effectiveDate")}</TableCell>
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
            ) : specDetail ? (
              <pre className="text-sm overflow-auto rounded bg-muted/50 p-4 max-h-96">
                {JSON.stringify(specDetail, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm">No details available.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sales detail - show when Sales selected and has selection */}
      {docType === "sales" && selectedSales && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sales Details</CardTitle>
          </CardHeader>
          <CardContent>
            {detailLoading ? (
              <p className="text-muted-foreground text-sm">Loading…</p>
            ) : salesDetail ? (
              <pre className="text-sm overflow-auto rounded bg-muted/50 p-4 max-h-96">
                {JSON.stringify(salesDetail, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground text-sm">No details available.</p>
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
