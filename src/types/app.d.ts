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

export interface UserSettings {
  weekStartDay: "monday" | "sunday"
  defaultTag: "positive" | "neutral" | "negative"
  defaultScore: number
  showScoreOnDashboard: boolean
  theme: "light" | "dark" | "system"
}

export interface Streak {
  currentStreak: number
  longestStreak: number
  lastEntryDate: string | null
  nextMilestone: number | null
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
