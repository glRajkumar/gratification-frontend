import { sendApiReq } from "@/services/send-api-req"
import { endpoints } from "@/services/endpoints"
import type { Category } from "@/types/app"

export function getCategories(): Promise<Category[]> {
  return sendApiReq({ method: "GET", url: endpoints.categories.list })
}

export function createCategory(data: {
  name: string
  color: string
  icon: string
}): Promise<Category> {
  return sendApiReq({ method: "POST", url: endpoints.categories.create, data })
}

export function updateCategory(
  id: string,
  data: Partial<{ name: string; color: string; icon: string }>,
): Promise<Category> {
  return sendApiReq({ method: "PUT", url: endpoints.categories.update(id), data })
}

export function deleteCategory(id: string): Promise<void> {
  return sendApiReq({ method: "DELETE", url: endpoints.categories.delete(id) })
}
