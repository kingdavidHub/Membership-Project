'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

type ExportFormatModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onExport: (format: 'xlsx' | 'pdf') => Promise<Blob>
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ExportFormatModal({
  open,
  onOpenChange,
  title,
  description,
  onExport
}: ExportFormatModalProps) {
  const [loading, setLoading] = useState<'xlsx' | 'pdf' | null>(null)

  const handleExport = async (format: 'xlsx' | 'pdf') => {
    setLoading(format)
    try {
      const blob = await onExport(format)
      const ext = format === 'xlsx' ? 'xlsx' : 'pdf'
      const mimeType = format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf'
      const file = new Blob([blob as unknown as BlobPart], { type: mimeType })
      const timestamp = new Date().toISOString().slice(0, 10)
      triggerDownload(file, `${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.${ext}`)
      toast.success(`${title} exported as ${format.toUpperCase()} successfully.`)
      onOpenChange(false)
    } catch {
      toast.error(`Failed to export ${title}. Please try again.`)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Pick the format you want to download:
        </p>
        <DialogFooter className="flex-row gap-2 sm:justify-end">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={loading !== null}
            onClick={() => handleExport('xlsx')}
          >
            {loading === 'xlsx' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            XLSX
          </Button>
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            disabled={loading !== null}
            onClick={() => handleExport('pdf')}
          >
            {loading === 'pdf' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
