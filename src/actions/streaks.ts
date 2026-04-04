import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { FullStreak } from "@/types/app"

export function getStreaks(): Promise<FullStreak> {
  return sendApiReq({ method: "GET", url: endpoints.streaks.get })
}

export function freezeStreak(): Promise<{ message: string; freezeTokens: number }> {
  return sendApiReq({ method: "POST", url: endpoints.streaks.freeze })
}

export function invitePartner(email: string): Promise<{ message: string; partnershipId: string; inviteToken: string }> {
  return sendApiReq({
    method: "POST",
    url: endpoints.streaks.partnerInvite,
    data: { email },
  })
}

export function acceptPartner(token: string): Promise<{ message: string }> {
  return sendApiReq({
    method: "POST",
    url: endpoints.streaks.partnerAccept,
    data: { token },
  })
}

export function removePartner(): Promise<{ message: string }> {
  return sendApiReq({ method: "DELETE", url: endpoints.streaks.partnerRemove })
}
