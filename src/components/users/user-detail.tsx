"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UsersDialogs } from "@/components/users/users-dialogs"
import { useUserQuery } from "@/hooks/use-users"
import { NotFoundError } from "@/lib/users/errors"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"
import type { User } from "@/types/user"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty"

function websiteHref(website: string) {
  if (website.startsWith("http://") || website.startsWith("https://")) {
    return website
  }
  return `https://${website}`
}

function DetailRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1 border-b py-3 last:border-b-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export function UserDetail({ userId }: { userId: number }) {
  const router = useRouter()
  const userQuery = useUserQuery(userId, Number.isInteger(userId))
  const openEdit = useUserDashboardStore((state) => state.openEdit)
  const openDelete = useUserDashboardStore((state) => state.openDelete)

  if (!Number.isInteger(userId) || userId < 1) {
    return <p>شناسه کاربر معتبر نیست.</p>
  }

  return (
    <div className="grid gap-6">
      <Button variant="ghost" className="w-fit" asChild>
        <Link href="/">بازگشت به فهرست</Link>
      </Button>

      {userQuery.isLoading ? (
        <Skeleton className="h-80 w-full" />
      ) : userQuery.error instanceof NotFoundError ? (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>کاربر پیدا نشد</EmptyTitle>
            <EmptyDescription>
              این کاربر وجود ندارد یا حذف شده است.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : userQuery.isError ? (
        <div className="grid justify-items-start gap-3">
          <p className="text-sm text-destructive">
            {userQuery.error instanceof Error
              ? userQuery.error.message
              : "دریافت جزئیات ناموفق بود"}
          </p>
          <Button variant="outline" onClick={() => userQuery.refetch()}>
            تلاش دوباره
          </Button>
        </div>
      ) : userQuery.data ? (
        <UserDetailCard
          user={userQuery.data}
          onEdit={() => openEdit(userQuery.data.id)}
          onDelete={() => openDelete(userQuery.data.id)}
        />
      ) : null}

      <UsersDialogs onDeleted={() => router.push("/")} />
    </div>
  )
}

function UserDetailCard({
  user,
  onEdit,
  onDelete,
}: {
  user: User
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>@{user.username}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <dl className="grid md:grid-cols-2 md:gap-x-8">
          <DetailRow label="ایمیل">{user.email}</DetailRow>
          <DetailRow label="تلفن">
            <span dir="ltr">{user.phone}</span>
          </DetailRow>
          <DetailRow label="وب‌سایت">
            <a
              href={websiteHref(user.website)}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {user.website}
            </a>
          </DetailRow>
          <DetailRow label="شهر">{user.address.city}</DetailRow>
          <DetailRow label="آدرس">
            {user.address.street} {user.address.suite}
          </DetailRow>
          <DetailRow label="شرکت">{user.company.name}</DetailRow>
          <DetailRow label="توضیح شرکت">{user.company.catchPhrase}</DetailRow>
        </dl>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onEdit}>
            ویرایش
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            حذف
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
