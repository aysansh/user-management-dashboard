"use client"

import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { UserFormDialog } from "@/components/users/user-form-dialog"

export function UsersDialogs({ onDeleted }: { onDeleted?: () => void }) {
  return (
    <>
      <UserFormDialog />
      <DeleteUserDialog onDeleted={onDeleted} />
    </>
  )
}
