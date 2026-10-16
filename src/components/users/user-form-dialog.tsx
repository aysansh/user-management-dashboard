"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import {
    useCreateUserMutation,
    useUpdateUserMutation,
    useUserQuery,
    useUsersQuery
} from "@/hooks/use-users"
import {
    emptyUserFormValues,
    formValuesToUserInput,
    userFormSchema,
    userToFormValues,
    type UserFormValues,
} from "@/lib/users/schema"
import { useUserDashboardStore } from "@/stores/user-dashboard-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export function UserFormDialog() {
  const dialog = useUserDashboardStore((state) => state.dialog)
  const closeDialog = useUserDashboardStore((state) => state.closeDialog)
  const editUserId = dialog.type === "edit" ? dialog.userId : null
  const usersQuery = useUsersQuery()
  const userQuery = useUserQuery(editUserId ?? 0,  editUserId !== null)
  const editing =
    editUserId === null
      ? undefined
      : (usersQuery.data?.find((user) => user.id === editUserId) ??
        userQuery.data)
  const createMutation = useCreateUserMutation()
  const updateMutation = useUpdateUserMutation()
  const pending = createMutation.isPending || updateMutation.isPending

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: emptyUserFormValues,
  })

  const { reset, register, handleSubmit, formState } = form

  useEffect(() => {
    if (dialog.type === "create") {
      reset(emptyUserFormValues)
      return
    }

    if (dialog.type === "edit" && editing?.id === dialog.userId) {
      reset(userToFormValues(editing))
    }
  }, [dialog, editing, reset])

  function onSubmit(values: UserFormValues) {
    if (dialog.type === "create") {
      createMutation.mutate(formValuesToUserInput(values), {
        onSuccess: closeDialog,
      })
      return
    }

    if (dialog.type === "edit" && editing) {
      updateMutation.mutate(
        { id: editing.id, ...formValuesToUserInput(values, editing) },
        { onSuccess: closeDialog },
      )
    }
  }

  const fields: Array<{ name: keyof UserFormValues; label: string }> = [
    { name: "name", label: "نام" },
    { name: "username", label: "نام کاربری" },
    { name: "email", label: "ایمیل" },
    { name: "phone", label: "تلفن" },
    { name: "website", label: "وب‌سایت" },
    { name: "city", label: "شهر" },
    { name: "companyName", label: "شرکت" },
  ]

  return (
    <Dialog
      open={dialog.type !== "closed"}
      onOpenChange={(open) => {
        if (!open && !pending) closeDialog()
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-x-hidden overflow-y-auto overscroll-contain sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {dialog.type === "edit" ? "ویرایش کاربر" : "افزودن کاربر"}
          </DialogTitle>
          <DialogDescription>
            این تغییر در همین مرورگر ذخیره می‌شود و بعد از تازه‌سازی می‌ماند.
          </DialogDescription>
        </DialogHeader>

        {dialog.type === "edit" && userQuery.isError ? (
          <p className="text-sm text-destructive">
            کاربر برای ویرایش پیدا نشد.
          </p>
        ) : dialog.type === "edit" && !editing ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <FieldGroup className="sm:grid sm:grid-cols-2 sm:gap-x-4">
              {fields.map((field) => {
                const message = formState.errors[field.name]?.message
                return (
                  <Field key={field.name} data-invalid={!!message}>
                    <FieldLabel htmlFor={field.name}>{field.label}</FieldLabel>
                    <Input
                      id={field.name}
                      dir={
                        field.name === "email" || field.name === "phone"
                          ? "ltr"
                          : undefined
                      }
                      aria-invalid={!!message}
                      {...register(field.name)}
                    />
                    <FieldError errors={[{ message }]} />
                  </Field>
                )
              })}
            </FieldGroup>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                انصراف
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? <Spinner /> : null}
                ذخیره
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
