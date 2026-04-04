import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { WeeklyIntention } from "@/types/app"

export function getCurrentIntention(): Promise<WeeklyIntention | null> {
  return sendApiReq<WeeklyIntention | null>({
    method: "GET",
    url: endpoints.intentions.current,
  })
}

export function setIntention(data: {
  intention: string
  targetScore?: number
  focusCategoryId?: string
}): Promise<WeeklyIntention> {
  return sendApiReq<WeeklyIntention>({
    method: "POST",
    url: endpoints.intentions.set,
    data,
  })
}
