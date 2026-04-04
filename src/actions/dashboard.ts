import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { DashboardContext } from "@/types/app"

export function getDashboardContext(): Promise<DashboardContext> {
  return sendApiReq<DashboardContext>({
    method: "GET",
    url: endpoints.dashboard.context,
  })
}
