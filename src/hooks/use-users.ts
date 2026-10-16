"use client"

import {
    createUser,
    deleteUser,
    getUser,
    listUsers,
    updateUser,
} from "@/lib/users/data"
import { userKeys } from "@/lib/users/keys"
import { User, UserInput } from "@/types/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"



export function useUsersQuery(enabled = true) {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: listUsers,
    enabled,
  })
}

export function useUserQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: enabled && Number.isInteger(id) && id > 0,
  })
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserInput) => createUser(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.list() })
      toast.success("کاربر اضافه شد")
    },
    onError: () => {
      toast.error("افزودن کاربر ناموفق بود")
    },
  })
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.list() })
      toast.success("تغییرات ذخیره شد")
    },
    onError: () => {
      toast.error("ویرایش کاربر ناموفق بود")
    },
  })
}
export function useDeleteUserMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: async (_data, id) => {
        queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: userKeys.all })
      toast.success("کاربر حذف شد")
    },
    onError: () => {
      toast.error("حذف کاربر ناموفق بود")
    },
  })
}
