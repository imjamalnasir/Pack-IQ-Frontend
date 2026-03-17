"use client"

import { useState } from "react"
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
  FieldTitle,
} from "@/components/ui/field"
import { FileCheck, Siren, MapPin, Hourglass } from "lucide-react"
import { cn } from "@/lib/utils"

/** Color class for a completeness percentage (green / orange / red). */
function percentColor(pct: number): string {
  if (pct >= 70) return "text-green-600 font-medium"
  if (pct >= 40) return "text-amber-600 font-medium"
  return "text-red-600 font-medium"
}

/** Sample rows for the Data Completeness table (Vendor + category percentages). */
const COMPLETENESS_ROWS = [
  { vendor: "FlexiPack Solutions", packaging: 95, weight: 5, material: 45, recyclability: 25 },
  { vendor: "Global Packaging Corp", packaging: 25, weight: 55, material: 5, recyclability: 35 },
  { vendor: "ClearWrap Industries", packaging: 65, weight: 75, material: 15, recyclability: 95 },
]

export default function DataCompletenessPage() {
  const [vendors, setVendors] = useState("all")
  const [products, setProducts] = useState("all")
  const [type, setType] = useState("all")

  return (
    <>
      <CardHeader className="py-4 flex flex-row items-start justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Data Completeness Dashboard
          </CardTitle>
          <CardDescription>
            Monitor data quality and completeness across all states and products
          </CardDescription>
        </div>
        <CardAction>
          <Button>Generate Report</Button>
        </CardAction>
      </CardHeader>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field>
              <FieldTitle>Select Vendors</FieldTitle>
              <FieldContent>
                <Select value={vendors} onValueChange={setVendors}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="flexipack">FlexiPack Solutions</SelectItem>
                    <SelectItem value="global">Global Packaging Corp</SelectItem>
                    <SelectItem value="clearwrap">ClearWrap Industries</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldTitle>Select Products</FieldTitle>
              <FieldContent>
                <Select value={products} onValueChange={setProducts}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Products" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Products</SelectItem>
                    <SelectItem value="p1">Product A</SelectItem>
                    <SelectItem value="p2">Product B</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
            <Field>
              <FieldTitle>Select Type</FieldTitle>
              <FieldContent>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bom">BOM</SelectItem>
                    <SelectItem value="spec">Spec</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Completeness</CardTitle>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              87%
            </CardTitle>
            <CardAction>
              <FileCheck className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">+3% from last week</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical Missing Fields</CardTitle>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              12
            </CardTitle>
            <CardAction>
              <Siren className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">States Affected</CardTitle>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              5/8
            </CardTitle>
            <CardAction>
              <MapPin className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">3 states at 100%</p>
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Resolution Time</CardTitle>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              2.3d
            </CardTitle>
            <CardAction>
              <Hourglass className="size-5 text-muted-foreground" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">-0.5d improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Completeness table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Completeness</CardTitle>
          <CardDescription>
            List of recent uploaded files and their status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Vendor</TableHead>
                <TableHead>Packaging</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Recyclability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPLETENESS_ROWS.map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.vendor}</TableCell>
                  <TableCell className={cn(percentColor(row.packaging))}>
                    {String(row.packaging).padStart(2, "0")}%
                  </TableCell>
                  <TableCell className={cn(percentColor(row.weight))}>
                    {String(row.weight).padStart(2, "0")}%
                  </TableCell>
                  <TableCell className={cn(percentColor(row.material))}>
                    {String(row.material).padStart(2, "0")}%
                  </TableCell>
                  <TableCell className={cn(percentColor(row.recyclability))}>
                    {String(row.recyclability).padStart(2, "0")}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}
