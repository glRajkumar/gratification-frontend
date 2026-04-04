import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type {
  PersonalityLabel,
  WrappedCard,
  ScorePercentile,
  ScoreMilestone,
} from "@/types/app"

export function getPersonalityLabel(): Promise<PersonalityLabel> {
  return sendApiReq<PersonalityLabel>({
    method: "GET",
    url: endpoints.personality.label,
  })
}

export function getWrapped(month?: string): Promise<WrappedCard> {
  return sendApiReq<WrappedCard>({
    method: "GET",
    url: endpoints.personality.wrapped,
    params: month ? { month } : undefined,
  })
}

export function getPercentile(): Promise<ScorePercentile> {
  return sendApiReq<ScorePercentile>({
    method: "GET",
    url: endpoints.personality.percentile,
  })
}

export function getScoreMilestones(): Promise<{
  milestones: ScoreMilestone[]
  newMilestones: ScoreMilestone[]
}> {
  return sendApiReq<{ milestones: ScoreMilestone[]; newMilestones: ScoreMilestone[] }>({
    method: "GET",
    url: endpoints.personality.milestones,
  })
}
