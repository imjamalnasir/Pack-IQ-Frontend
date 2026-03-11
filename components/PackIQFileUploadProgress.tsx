import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { Card } from "./ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileUp, X } from "lucide-react"

interface PackIQFileUploadProgressProps {
  /** File name to show; when null/undefined, nothing is rendered. */
  fileName?: string | null
  /** Progress 0–100; defaults to 0. */
  progress?: number
  /** Success message to show when upload is done (e.g. processing notification). */
  successMessage?: string | null
  /** When true, show close button (e.g. upload has error). */
  hasError?: boolean
  /** Called when user clicks the close button (shown when complete or has error). */
  onClose?: () => void
}

export function PackIQFileUploadProgress({
  fileName,
  progress = 0,
  successMessage,
  hasError = false,
  onClose,
}: PackIQFileUploadProgressProps) {
  if (fileName == null || fileName === "") return null

  const isComplete = progress >= 100
  const showCloseButton = (isComplete || hasError) && onClose

  const badgeVariant = hasError ? "outline" : isComplete ? "default" : "secondary"
  const badgeLabel = hasError ? "Error" : isComplete ? "Completed" : "Progressing"
  const badgeClass = hasError ? "bg-red-100 text-red-800 border-red-200" : undefined

  return (
    <div className="flex flex-col gap-4">
      <Card className="relative">
        <Field className="w-full px-4">
          <FieldLabel htmlFor="progress-upload" className="flex flex-row flex-wrap items-center gap-2">
            <div className="flex flex-row gap-2 items-center min-w-0">
              <FileUp />
              <div className="min-w-0 truncate">{fileName}</div>
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              <Badge
                variant={badgeVariant}
                className={badgeClass}
              >
                {badgeLabel}
              </Badge>
              {showCloseButton && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={onClose}
                  aria-label="Close"
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          </FieldLabel>
          <Progress value={progress} id="progress-upload" />
          <FieldLabel htmlFor="progress-upload">
            <span>Upload progress</span>
            <span className="ml-auto">{Math.round(progress)}%</span>
          </FieldLabel>
          {isComplete && successMessage && (
            <p className="text-sm text-green-600 mt-2">{successMessage}</p>
          )}
        </Field>
      </Card>
    </div>
  )
}
