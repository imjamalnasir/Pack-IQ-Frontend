import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  FileSpreadsheet,
  FileBox,
  FileChartColumnIncreasing,
} from "lucide-react"
import { CardTitle } from "./ui/card"

export type DocType = "bom" | "spec" | "sales"

interface PackIQRadioGroupChoiceCardProps {
  /** Selected extraction type; maps to API doc_type. */
  value?: DocType
  /** Called when selection changes. */
  onValueChange?: (value: DocType) => void
}

export function PackIQRadioGroupChoiceCard({
  value = "bom",
  onValueChange,
}: PackIQRadioGroupChoiceCardProps) {
  return (
    <div className="">
      <CardTitle className="ml-6 mt-2 ">Extraction Type Selection</CardTitle>
      <RadioGroup
        value={value}
        onValueChange={(v) => onValueChange?.(v as DocType)}
        className="grid grid-cols-3 gap-4 p-6"
      >
        <FieldLabel htmlFor="doc-bom">
          <Field orientation="horizontal">
            <FieldContent className="gap-2">
              <FileSpreadsheet />
              <FieldTitle>BOM Only</FieldTitle>
              <FieldDescription>
                Extract Bill of Materials data including component weights and materials
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="bom" id="doc-bom" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="doc-spec">
          <Field orientation="horizontal">
            <FieldContent className="gap-2">
              <FileBox />
              <FieldTitle>Spec Only</FieldTitle>
              <FieldDescription>
                Extract packaging specifications including dimensions and material codes
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="spec" id="doc-spec" />
          </Field>
        </FieldLabel>
        <FieldLabel htmlFor="doc-sales">
          <Field orientation="horizontal">
            <FieldContent className="gap-2">
              <FileChartColumnIncreasing />
              <FieldTitle>Sales</FieldTitle>
              <FieldDescription>
                Extract sales data for EPR compliance reporting
              </FieldDescription>
            </FieldContent>
            <RadioGroupItem value="sales" id="doc-sales" />
          </Field>
        </FieldLabel>
      </RadioGroup>
    </div>
  )
}
