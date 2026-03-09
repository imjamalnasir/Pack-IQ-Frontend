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

export function PackIQRadioGroupChoiceCard() {
  return (
    <div className="">
      <CardTitle className="ml-6">
          Extraction Type Selection
          </CardTitle>
    <RadioGroup defaultValue="plus" className=" grid grid-cols-3 gap-4 p-6 " >
      <FieldLabel htmlFor="plus-plan">
        <Field orientation="horizontal">
          <FieldContent className=" gap-2">
            <FileSpreadsheet/>
            <FieldTitle>BOM Only</FieldTitle>
            <FieldDescription>
              Extract Bill of Materials data including component weights and materials
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id="plus-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="pro-plan">
        <Field orientation="horizontal">
          <FieldContent className=" gap-2">
            <FileBox/>
            <FieldTitle>Spec Only</FieldTitle>
            <FieldDescription>Extract packaging specifications including dimensions and material codesP</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="pro-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="enterprise-plan">
        <Field orientation="horizontal">
          <FieldContent className=" gap-2">
            <FileChartColumnIncreasing/>
            <FieldTitle>Sales</FieldTitle>
            <FieldDescription>
              Extract sales data for EPR compliance reporting
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="enterprise" id="enterprise-plan" />
        </Field>
      </FieldLabel>
    </RadioGroup>
    </div>
  )
}
