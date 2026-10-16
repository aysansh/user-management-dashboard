"use client"

import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCards } from "@/components/users/user-cards"
import { UserFilters } from "@/components/users/user-filters"
import { UserTable } from "@/components/users/user-table"
import { UsersDialogs } from "@/components/users/users-dialogs"
import { useUsersQuery } from "@/hooks/use-users"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { useEffect, useMemo } from "react"

export function UsersDashboard() {
  const usersQuery = useUsersQuery()
  const search = useUserDashboardStore((state) => state.search)
  const city = useUserDashboardStore((state) => state.city)
  const sort = useUserDashboardStore((state) => state.sort)
  const page = useUserDashboardStore((state) => state.page)
  const pageSize = useUserDashboardStore((state) => state.pageSize)
  const setPage = useUserDashboardStore((state) => state.setPage)
  const openCreate = useUserDashboardStore((state) => state.openCreate)
  const users = useMemo(() => usersQuery.data ?? [], [usersQuery.data])

  const cities = useMemo(
    () =>
      Array.from(new Set(users.map((user) => user.address.city))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [users],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    // 1. filter (your existing code, saved in a variable instead of returned)
    const result = users.filter((user) => {
      const matchesSearch =
        query.length === 0 ||
        [user.name, user.username, user.email].some((value) =>
          value.toLowerCase().includes(query),
        )
      const matchesCity = city === "all" || user.address.city === city
      return matchesSearch && matchesCity
    })

    // 2. sort
    result.sort((a, b) => {
      if (sort === "name-asc") return a.name.localeCompare(b.name)
      if (sort === "name-desc") return b.name.localeCompare(a.name)
      if (sort === "email-asc") return a.email.localeCompare(b.email)
      if (sort === "company-asc")
        return a.company.name.localeCompare(b.company.name)
      return b.id - a.id // "newest": bigger id first
    })

    // 3. give back the filtered + sorted list
    return result
  }, [users, search, city, sort])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageUsers = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage)
  }, [page, currentPage, setPage])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-semibold">مدیریت کاربران</h1>
          <p className="text-sm text-muted-foreground">
            فهرست از سرویس نمونه خوانده می‌شود. افزودن، ویرایش و حذف در همین
            مرورگر می‌ماند.
          </p>
        </div>
        <Button onClick={openCreate}>افزودن کاربر</Button>
      </div>

      <UserFilters cities={cities} />

      { usersQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : usersQuery.isError ? (
        <div className="grid justify-items-start gap-3">
          <p className="text-sm text-destructive">
            {usersQuery.error instanceof Error
              ? usersQuery.error.message
              : "دریافت کاربران ناموفق بود"}
          </p>
          <Button variant="outline" onClick={() => usersQuery.refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : users.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>کاربری ثبت نشده است</EmptyTitle>
            <EmptyDescription>اولین کاربر را اضافه کنید.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>نتیجه‌ای پیدا نشد</EmptyTitle>
            <EmptyDescription>
              عبارت جستجو یا شهر را تغییر دهید.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-4">
          <UserTable users={pageUsers} />
          <UserCards users={pageUsers} />
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => setPage(currentPage - 1)}
              >
                <ArrowRightIcon />
                قبلی
              </Button>
              <Button
                variant="outline"
                disabled={currentPage >= pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                بعدی
                <ArrowLeftIcon />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              صفحه {currentPage} از {pageCount}
            </p>
          </div>
        </div>
      )}

      <UsersDialogs />
    </div>
  )
}
