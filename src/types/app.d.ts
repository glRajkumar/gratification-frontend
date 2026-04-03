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
  createdAt: string
  updatedAt: string
}

export interface JournalPointWithReflections extends JournalPoint {
  reflections: Reflection[]
}

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
