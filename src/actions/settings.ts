import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { UserSettings } from "@/types/app"
import type { SettingsFormData } from "@/utils/schemas"

export function getSettings(): Promise<UserSettings> {
  return sendApiReq({ method: "GET", url: endpoints.settings.get })
}

export function updateSettings(data: Partial<SettingsFormData>): Promise<UserSettings> {
  return sendApiReq({ method: "PUT", url: endpoints.settings.update, data })
}
