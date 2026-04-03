import { api, endpoints } from "@/services/api"
import type { Category } from "@/types/app"

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get(endpoints.categories.list)
  return data
}

export async function createCategory(body: {
  name: string
  color: string
  icon: string
}): Promise<Category> {
  const { data } = await api.post(endpoints.categories.create, body)
  return data
}

export async function updateCategory(
  id: string,
  body: Partial<{ name: string; color: string; icon: string }>,
): Promise<Category> {
  const { data } = await api.put(endpoints.categories.update(id), body)
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(endpoints.categories.delete(id))
}
