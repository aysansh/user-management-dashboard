"use client"

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
    useDeleteUserMutation,
    useUserQuery,
    useUsersQuery
} from "@/hooks/use-users"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"

export function DeleteUserDialog({ onDeleted }: { onDeleted?: () => void }) {

  const deleteUserId = useUserDashboardStore((state) => state.deleteUserId)
  const closeDelete = useUserDashboardStore((state) => state.closeDelete)
  const usersQuery = useUsersQuery()
  const userQuery = useUserQuery(
    deleteUserId ?? 0,
     deleteUserId !== null,
  )
  const deleteMutation = useDeleteUserMutation()
  const user =
    usersQuery.data?.find((item) => item.id === deleteUserId) ?? userQuery.data

  return (
    <AlertDialog
      open={deleteUserId !== null}
      onOpenChange={(open) => {
        if (!open && !deleteMutation.isPending) closeDelete()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
          <AlertDialogDescription>
            {user
              ? `می‌خواهید ${user.name} را حذف کنید؟`
              : "می‌خواهید این کاربر را حذف کنید؟"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMutation.isPending}>
            انصراف
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteUserId === null || deleteMutation.isPending}
            onClick={() => {
              if (deleteUserId === null) return
              deleteMutation.mutate(deleteUserId, {
                onSuccess: () => {
                  closeDelete()
                  onDeleted?.()
                },
              })
            }}
          >
            {deleteMutation.isPending ? <Spinner /> : null}
            حذف
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
