import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Streak } from "@/types/app"

export function getStreaks(): Promise<Streak> {
  return sendApiReq({ method: "GET", url: endpoints.streaks.get })
}
