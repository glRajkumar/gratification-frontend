import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Achievement } from "@/types/app"

export function getAchievements(): Promise<Achievement[]> {
  return sendApiReq({ method: "GET", url: endpoints.achievements.list })
}
