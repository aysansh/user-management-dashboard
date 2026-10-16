import { getUserFromApi, listUsersFromApi } from "@/lib/users/api"
import { readChanges, writeChanges } from "@/lib/users/storage"
import type { User, UserInput } from "@/types/user"
import { NotFoundError } from "./errors"

export async function listUsers(): Promise<User[]> {
  const remote = await listUsersFromApi()
  const changes = readChanges()
  const updatedById = new Map(
    changes.updated.map((user: User) => [user.id, user]),
  )

  const visible = remote
    .filter((user) => !changes.deletedIds.includes(user.id))
    .map((user) => updatedById.get(user.id) ?? user)

  return [...visible, ...changes.created]
}

export async function getUser(id: number): Promise<User> {
  const changes = readChanges()

  if (changes.deletedIds.includes(id)) {
    throw new NotFoundError()
  }

  const local =
    changes.created.find((user: User) => user.id === id) ??
    changes.updated.find((user: User) => user.id === id)

  if (local) return local

  return getUserFromApi(id)
}

export async function createUser(input: UserInput): Promise<User> {
  const remote = await listUsersFromApi()
  const changes = readChanges()
  const ids = [
    ...remote.map((user) => user.id),
    ...changes.created.map((user: User) => user.id),
    ...changes.updated.map((user: User) => user.id),
    ...changes.deletedIds,
  ]
  const nextId = ids.reduce((max, id) => Math.max(max, id), 0) + 1
  const user: User = { ...input, id: nextId }

  writeChanges({
    ...changes,
    created: [...changes.created, user],
  })

  return user
}

export async function updateUser(user: User): Promise<User> {
  const changes = readChanges()
  const createdIndex = changes.created.findIndex(
    (item: User) => item.id === user.id,
  )

  if (createdIndex >= 0) {
    const created = changes.created.slice()
    created[createdIndex] = user
    writeChanges({ ...changes, created })
    return user
  }

  writeChanges({
    ...changes,
    updated: [
      ...changes.updated.filter((item: User) => item.id !== user.id),
      user,
    ],
  })

  return user
}

export async function deleteUser(id: number): Promise<void> {
  const changes = readChanges()
  const created = changes.created.filter((user: User) => user.id !== id)

  if (created.length !== changes.created.length) {
    writeChanges({ ...changes, created })
    return
  }

  writeChanges({
    ...changes,
    updated: changes.updated.filter((user: User) => user.id !== id),
    deletedIds: changes.deletedIds.includes(id)
      ? changes.deletedIds
      : [...changes.deletedIds, id],
  })
}
