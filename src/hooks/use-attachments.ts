import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  uploadAttachments,
  deleteAttachment,
} from "@/actions/attachments"

export function useUploadAttachments(journalPointId: string) {
  const qc = useQueryClient()
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: (files: File[]) =>
      uploadAttachments(journalPointId, files, setProgress),
    onSuccess(data) {
      setProgress(0)
      qc.invalidateQueries({ queryKey: ["journal", journalPointId] })
      if (data.skipped.length > 0) {
        toast.warning(`${data.attachments.length} uploaded. Skipped: ${data.skipped.join(", ")}`)
      } else {
        toast.success(`${data.attachments.length} file${data.attachments.length !== 1 ? "s" : ""} uploaded`)
      }
    },
    onError(error) {
      setProgress(0)
      toast.error(error?.message || "Upload failed")
    },
  })

  return { ...mutation, progress }
}

export function useDeleteAttachment(journalPointId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess() {
      qc.invalidateQueries({ queryKey: ["journal", journalPointId] })
      toast.success("Attachment deleted")
    },
    onError(error) {
      toast.error(error?.message || "Delete failed")
    },
  })
}
