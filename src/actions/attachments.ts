import axios from "axios"
import { endpoints } from "@/services/endpoints"
import type { Attachment } from "@/types/app"

const BASE_URL = "http://localhost:8000/api"

export type UploadResult = {
  attachments: Attachment[]
  skipped: string[]
}

export function uploadAttachments(
  journalPointId: string,
  files: File[],
  onProgress?: (pct: number) => void,
): Promise<UploadResult> {
  const form = new FormData()
  for (const file of files) form.append("files", file)

  return axios
    .post<UploadResult>(
      `${BASE_URL}${endpoints.attachments.upload(journalPointId)}`,
      form,
      {
        withCredentials: true,
        onUploadProgress(e) {
          if (e.total && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
        },
      },
    )
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(err?.response?.data?.message ?? err?.message ?? "Upload failed")
    })
}

export function deleteAttachment(id: string): Promise<void> {
  return axios
    .delete(`${BASE_URL}${endpoints.attachments.delete(id)}`, {
      withCredentials: true,
    })
    .then(() => undefined)
    .catch((err) => {
      throw new Error(err?.response?.data?.message ?? err?.message ?? "Delete failed")
    })
}
