"use client"

import Link from "next/link"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"
import type { User } from "@/types/user"

export function UserRowActions({ user }: { user: User }) {
  const openEdit = useUserDashboardStore((state) => state.openEdit)
  const openDelete = useUserDashboardStore((state) => state.openDelete)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`عملیات ${user.name}`}>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem asChild>
          <Link href={`/users/${user.id}`}>مشاهده</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openEdit(user.id)}>
          ویرایش
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => openDelete(user.id)}
        >
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
