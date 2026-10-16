"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"

export const SORT_OPTIONS = [
  { value: "name-asc", label: "نام (صعودی)" },
  { value: "name-desc", label: "نام (نزولی)" },
  { value: "email-asc", label: "ایمیل" },
  { value: "company-asc", label: "شرکت" },
  { value: "newest", label: "جدیدترین" },
] as const

export type SortOption = (typeof SORT_OPTIONS)[number]["value"]

export function UserFilters({ cities }: { cities: string[] }) {
  const search = useUserDashboardStore((state) => state.search)
  const city = useUserDashboardStore((state) => state.city)
  const sort = useUserDashboardStore((state) => state.sort)
  const setSort = useUserDashboardStore((state) => state.setSort)
  const setSearch = useUserDashboardStore((state) => state.setSearch)
  const setCity = useUserDashboardStore((state) => state.setCity)

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="جستجو بر اساس نام، نام کاربری یا ایمیل"
        className="sm:max-w-sm"
      />
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="شهر" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه شهرها</SelectItem>
          {cities.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={sort}
        onValueChange={(value) => setSort(value as SortOption)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="مرتب‌سازی" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
