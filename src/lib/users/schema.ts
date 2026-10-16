import { z } from "zod"
import type { User, UserInput } from "@/types/user"

export const userFormSchema = z.object({
  name: z.string().trim().min(2, "نام باید حداقل ۲ حرف باشد"),
  username: z.string().trim().min(2, "نام کاربری باید حداقل ۲ حرف باشد"),
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "ایمیل معتبر وارد کنید"),
  phone: z.string().trim().min(1, "شماره تلفن را وارد کنید"),
  website: z.string().trim().min(1, "وب‌سایت را وارد کنید"),
  city: z.string().trim().min(1, "شهر را وارد کنید"),
  companyName: z.string().trim().min(1, "نام شرکت را وارد کنید"),
})

export type UserFormValues = z.infer<typeof userFormSchema>

export const emptyUserFormValues: UserFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  city: "",
  companyName: "",
}

export function userToFormValues(user: User): UserFormValues {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    phone: user.phone,
    website: user.website,
    city: user.address.city,
    companyName: user.company.name,
  }
}

export function formValuesToUserInput(
  values: UserFormValues,
  base?: User,
): UserInput {
  return {
    name: values.name,
    username: values.username,
    email: values.email,
    phone: values.phone,
    website: values.website,
    address: {
      street: base?.address.street ?? "",
      suite: base?.address.suite ?? "",
      city: values.city,
      zipcode: base?.address.zipcode ?? "",
      geo: base?.address.geo ?? { lat: "", lng: "" },
    },
    company: {
      name: values.companyName,
      catchPhrase: base?.company.catchPhrase ?? "",
      bs: base?.company.bs ?? "",
    },
  }
}
