import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { DailyChallenge, ChallengeHistory } from "@/types/app"

export function getChallengeToday(): Promise<DailyChallenge> {
  return sendApiReq<DailyChallenge>({
    method: "GET",
    url: endpoints.challenges.today,
  })
}

export function completeChallenge(data: {
  challengeKey: string
  journalPointId?: string
}): Promise<{ id: string; challengeKey: string; date: string }> {
  return sendApiReq({
    method: "POST",
    url: endpoints.challenges.complete,
    data,
  })
}

export function getChallengeHistory(): Promise<ChallengeHistory> {
  return sendApiReq<ChallengeHistory>({
    method: "GET",
    url: endpoints.challenges.history,
  })
}
