import Link from "next/link"
import { UserRowActions } from "@/components/users/user-row-actions"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { User } from "@/types/user"

export function UserCards({ users }: { users: User[] }) {
  return (
    <div className="grid gap-3 md:hidden">
      {users.map((user) => (
        <Card key={user.id} size="sm">
          <CardHeader>
            <CardTitle>
              <Link href={`/users/${user.id}`} className="hover:underline">
                {user.name}
              </Link>
            </CardTitle>
            <CardAction>
              <UserRowActions user={user} />
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-1 text-sm">
            <p>{user.username}</p>
            <p>{user.email}</p>
            <p dir="ltr" className="text-end">
              {user.phone}
            </p>
            <p>
              {user.address.city} · {user.company.name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
