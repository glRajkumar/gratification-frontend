export const endpoints = {
  categories: {
    list: "/categories",
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  journal: {
    list: "/journal",
    create: "/journal",
    get: (id: string) => `/journal/${id}`,
    update: (id: string) => `/journal/${id}`,
    delete: (id: string) => `/journal/${id}`,
    score: "/journal/score",
    addReflection: (id: string) => `/journal/${id}/reflections`,
    onThisDay: "/journal/on-this-day",
  },
  reflections: {
    update: (id: string) => `/reflections/${id}`,
    delete: (id: string) => `/reflections/${id}`,
  },
  todos: {
    list: "/todos",
    create: "/todos",
    update: (id: string) => `/todos/${id}`,
    delete: (id: string) => `/todos/${id}`,
    complete: (id: string) => `/todos/${id}/complete`,
  },
  goals: {
    list: "/goals",
    create: "/goals",
    update: (id: string) => `/goals/${id}`,
    delete: (id: string) => `/goals/${id}`,
    addProgress: (id: string) => `/goals/${id}/progress`,
    close: (id: string) => `/goals/${id}/close`,
  },
  analytics: {
    scoreHistory: "/analytics/score-history",
    heatmap: "/analytics/heatmap",
    weeklySummary: "/analytics/weekly-summary",
    categoryBreakdown: "/analytics/category-breakdown",
    correlations: "/analytics/correlations",
  },
  streaks: {
    get: "/streaks",
  },
  achievements: {
    list: "/achievements",
  },
  habits: {
    list: "/habits",
    create: "/habits",
    update: (id: string) => `/habits/${id}`,
    delete: (id: string) => `/habits/${id}`,
    check: (id: string) => `/habits/${id}/check`,
    stats: (id: string) => `/habits/${id}/stats`,
  },
  export: {
    get: "/export",
  },
  settings: {
    get: "/settings",
    update: "/settings",
  },
  attachments: {
    upload: (journalPointId: string) => `/journal/${journalPointId}/attachments`,
    delete: (id: string) => `/attachments/${id}`,
  },
} as const
