import { SortOption } from "@/components/users/user-filters"
import { create } from "zustand"

type DialogState =
  { type: "closed" } | { type: "create" } | { type: "edit"; userId: number }

type UserDashboardState = {
  search: string
  city: string
  page: number
  pageSize: number
  dialog: DialogState
  deleteUserId: number | null
  setSearch: (search: string) => void
  setCity: (city: string) => void
  setPage: (page: number) => void
  openCreate: () => void
  openEdit: (userId: number) => void
  closeDialog: () => void
  openDelete: (userId: number) => void
  closeDelete: () => void
  sort: SortOption
  setSort: (sort: SortOption) => void
}

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  search: "",
  city: "all",
  page: 1,
  pageSize: 5,
  dialog: { type: "closed" },
  deleteUserId: null,
  setSearch: (search) => set({ search, page: 1 }),
  setCity: (city) => set({ city, page: 1 }),
  setPage: (page) => set({ page }),
  openCreate: () => set({ dialog: { type: "create" } }),
  openEdit: (userId) => set({ dialog: { type: "edit", userId } }),
  closeDialog: () => set({ dialog: { type: "closed" } }),
  openDelete: (userId) => set({ deleteUserId: userId }),
  closeDelete: () => set({ deleteUserId: null }),
  sort: "newest",
  setSort: (sort) => set({ sort, page: 1 }),
}))
