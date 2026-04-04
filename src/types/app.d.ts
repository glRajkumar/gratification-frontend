export interface Category {
  id: string
  userId: string
  name: string
  color: string
  icon: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface JournalPoint {
  id: string
  userId: string
  title: string
  description: string | null
  date: string
  time: string | null
  categoryId: string | null
  score: number
  tag: "positive" | "negative" | "neutral"
  mood: number | null
  createdAt: string
  updatedAt: string
}

export interface Attachment {
  id: string
  journalPointId: string
  userId: string
  type: "image" | "audio" | "video"
  url: string
  publicId: string
  filename: string | null
  size: number | null
  createdAt: string
}

export interface JournalPointWithReflections extends JournalPoint {
  reflections: Reflection[]
  attachments: Attachment[]
}

export type CognitiveDistortion =
  | "catastrophizing"
  | "all_or_nothing"
  | "mind_reading"
  | "overgeneralization"
  | "personalization"
  | "emotional_reasoning"
  | "should_statements"
  | "labeling"
  | "magnification"

export interface Reflection {
  id: string
  journalPointId: string
  type:
    | "positive_aspect"
    | "negative_aspect"
    | "lesson_learned"
    | "alternative_action"
    | "why_it_happened"
    | "custom"
  content: string
  cognitiveDistortion: CognitiveDistortion | null
  createdAt: string
  updatedAt: string
}

export interface DailyScore {
  date: string
  score: number
  count: number
}

export interface Todo {
  id: string
  userId: string
  title: string
  categoryId: string | null
  dueDate: string | null
  status: "pending" | "completed" | "missed"
  journalPointId: string | null
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  userId: string
  title: string
  categoryId: string | null
  period: "daily" | "weekly" | "monthly"
  targetCount: number
  startDate: string
  endDate: string
  status: "active" | "achieved" | "partial" | "missed"
  journalPointId: string | null
  createdAt: string
  updatedAt: string
}

export interface GoalProgress {
  id: string
  goalId: string
  journalPointId: string
  createdAt: string
}

export interface Achievement {
  type: string
  label: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt: string | null
}

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "custom"

export interface Habit {
  id: string
  userId: string
  title: string
  categoryId: string | null
  frequency: HabitFrequency
  customDays: string | null
  targetCount: number
  color: string
  icon: string
  autoJournalOnComplete: boolean
  autoJournalOnMiss: boolean
  createdAt: string
  archivedAt: string | null
}

export interface HabitEntry {
  id: string
  habitId: string
  userId: string
  date: string
  completed: boolean
  note: string | null
  createdAt: string
}

export interface HabitWithTodayEntry extends Habit {
  todayEntry: HabitEntry | null
  scheduledToday: boolean
}

export interface HabitStats {
  habit: Habit
  heatmap: { date: string; completed: boolean; scheduled: boolean }[]
  scheduledDays: number
  completedDays: number
  strength: number
}


export interface ScoreHistoryPoint {
  date: string
  score: number
}

export interface ScoreHistory {
  data: ScoreHistoryPoint[]
  rollingAvg: { date: string; avg: number }[]
}

export interface WeeklySummary {
  week: string
  start: string
  end: string
  totalScore: number
  prevWeekScore: number
  scoreVsPrevWeek: number
  bestDay: { date: string; score: number } | null
  worstDay: { date: string; score: number } | null
  topPositiveCategory: Category | null
  topNegativeCategory: Category | null
  todosCompleted: number
  activeGoals: number
  summary: string
}

export interface CategoryBreakdown {
  categoryId: string
  categoryName: string
  categoryColor: string
  categoryIcon: string
  score: number
  positiveCount: number
  negativeCount: number
}

export interface Correlation {
  categoryId: string
  categoryName: string
  daysWithCategory: number
  avgScoreWithCategory: number
  avgScoreWithoutCategory: number
  percentDiff: number
}

export interface OnThisDayGroup {
  year: number
  points: JournalPoint[]
}

export interface DashboardContext {
  greeting: string
  greetingKey: string
  currentStreak: number
  daysSinceEntry: number | null
  avg7: number
  avg30: number
  scoreFloor: {
    thisMonthWorst: number
    lastMonthWorst: number
    improved: boolean
    diff: number
  } | null
}

export interface PersonalityLabel {
  label: string
  description: string
}

export interface WrappedCard {
  month: string
  empty: boolean
  totalScore?: number
  bestDay?: { date: string; score: number; title: string | null } | null
  worstDay?: { date: string; score: number; title: string | null } | null
  personalityLabel?: string
  topCategory?: Category | null
  entriesLogged?: number
  quickEntries?: number
  reflectionsAdded?: number
  streakPeak?: number
  graphData?: { date: string; score: number }[]
}

export interface ScorePercentile {
  userAvg: number
  percentile: number | null
  cohortSize: number
}

export interface ScoreMilestone {
  id: string
  userId: string
  type:
    | "first_8_day"
    | "personal_best_day"
    | "first_positive_month"
    | "best_month_ever"
    | "better_floor"
    | "comeback"
  value: number | null
  date: string
  celebratedAt: string | null
  createdAt: string
}

export interface CommunityStats {
  weekAvgScore: number
  topPositiveCategory: string | null
  totalEntries: number
  activeDays: number
}

export interface DailyChallenge {
  category: string
  key: string
  prompt: string
  date: string
  completed: boolean
  journalPointId: string | null
}

export interface ChallengeHistory {
  total: number
  completions: {
    id: string
    challengeKey: string
    journalPointId: string | null
    date: string
  }[]
}

export interface WeeklyIntention {
  id: string
  userId: string
  week: string
  intention: string
  targetScore: number | null
  focusCategoryId: string | null
  journalPointId: string | null
  createdAt: string
  updatedAt: string
}

export interface StreakPartner {
  id: string
  partnerName: string
  currentStreak: number
  longestStreak: number
  partnerLoggedToday: boolean
  startDate: string | null
}

export interface FullStreak {
  currentStreak: number
  longestStreak: number
  lastEntryDate: string | null
  nextMilestone: number | null
  strengthPercent: number
  daysSinceEntry: number | null
  currentScoreStreak: number
  longestScoreStreak: number
  avg30: number
  freezeTokens: number
  partner: StreakPartner | null
}

export interface UserSettings {
  weekStartDay: "monday" | "sunday"
  defaultTag: "positive" | "neutral" | "negative"
  defaultScore: number
  showScoreOnDashboard: boolean
  theme: "light" | "dark" | "system"
  freezeTokens: number
  morningEveningMode: boolean
  companionName: string | null
  weeklyIntentionEnabled: boolean
}
