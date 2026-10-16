export const userKeys = {
  all: ["users"] as const,
  list: () => ["users", "list"] as const,
  detail: (id: number) => ["users","detail", id] as const,
}
