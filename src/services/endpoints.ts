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
} as const
