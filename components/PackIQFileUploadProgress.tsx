import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Card } from "./ui/card"
//import { Badge } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
FileUp


} from "lucide-react"

export function PackIQFileUploadProgress() {
  return (
    <div className="flex flex-col gap-4">
        <Card>
    <Field className="w-full px-4">
        
        <FieldLabel htmlFor="progress-upload">
        <div className="flex flex-row gap-2 items-end"><FileUp/><div>Packaging_Specs_Q1.pdf</div></div>
        <span className="ml-auto">
            <Badge>Completed</Badge>
            </span>
      </FieldLabel>
        <Progress value={100} id="progress-upload" />
      <FieldLabel htmlFor="progress-upload">
        <span>Upload progress</span>
        <span className="ml-auto">100%</span>
      </FieldLabel>
      </Field>
      </Card>
      <Card>
      <Field className="w-full px-4">
    
              <FieldLabel htmlFor="progress-upload">
        <span>Material_BOM_2026.xlsx</span>
        <span className="ml-auto">
            <Badge variant="secondary">Progressing</Badge>
            </span>
      </FieldLabel>
        <Progress value={60} id="progress-upload" />
      <FieldLabel htmlFor="progress-upload">
        <span>Upload progress</span>
        <span className="ml-auto">60%</span>
      </FieldLabel>
      
      
    </Field>
    </Card>
    </div>
   
    
    
  )
}
