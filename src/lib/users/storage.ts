import { User } from "@/types/user"

const STORAGE_KEY = "user-dashboard-changes"

export type StoredChanges = {
  created: User[]
  updated: User[]
  deletedIds: number[]
}

function emptyChanges(): StoredChanges {
  return { created: [], updated: [], deletedIds: [] }
}

export function readChanges(): StoredChanges {
  if (typeof window === "undefined") return emptyChanges()
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return emptyChanges()
  try {
    const parsed = JSON.parse(raw) as Partial<StoredChanges>
    return {
      created: Array.isArray(parsed.created) ? parsed.created : [],
      updated: Array.isArray(parsed.updated) ? parsed.updated : [],
      deletedIds: Array.isArray(parsed.deletedIds) ? parsed.deletedIds : [],
    }
  } catch {
    return emptyChanges()
  }
}

export function writeChanges(changes: StoredChanges) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(changes))
}
