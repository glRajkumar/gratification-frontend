import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { getSettings, updateSettings } from "@/actions/settings"
import type { SettingsFormData } from "@/utils/schemas"

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SettingsFormData>) => updateSettings(data),
    onSuccess(data) {
      qc.setQueryData(["settings"], data)
      toast.success("Settings saved")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong")
    },
  })
}
