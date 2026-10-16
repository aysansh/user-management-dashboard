import type { User } from "@/types/user"
import { NotFoundError } from "./errors"

const USERS_API_URL = "https://jsonplaceholder.typicode.com/users"

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
    if (response.status === 404) throw new NotFoundError()
      if (!response.ok) throw new Error("ارتباط با سرور ناموفق بود")
  return response.json()
}

export function listUsersFromApi() {
  return getJson<User[]>(USERS_API_URL)
}

export function getUserFromApi(id: number) {
  return getJson<User>(`${USERS_API_URL}/${id}`)
}
