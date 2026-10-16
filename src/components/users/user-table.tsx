import Link from "next/link"
import { UserRowActions } from "@/components/users/user-row-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { User } from "@/types/user"

export function UserTable({ users }: { users: User[] }) {
  return (
    <div className="hidden overflow-hidden rounded-lg border md:block">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead>نام</TableHead>
            <TableHead>نام کاربری</TableHead>
            <TableHead>ایمیل</TableHead>
            <TableHead>تلفن</TableHead>
            <TableHead>شهر</TableHead>
            <TableHead>شرکت</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">عملیات</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="odd:bg-muted/50 even:bg-card">
              <TableCell>
                <Link
                  href={`/users/${user.id}`}
                  className="font-medium hover:underline"
                >
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell dir="ltr" className="text-end">
                {user.phone}
              </TableCell>
              <TableCell>{user.address.city}</TableCell>
              <TableCell>{user.company.name}</TableCell>
              <TableCell>
                <UserRowActions user={user} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
