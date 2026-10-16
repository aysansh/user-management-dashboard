import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { UserDetail } from "@/components/users/user-detail"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "جزئیات کاربر",
}

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  return (
    <Suspense fallback={<UserDetailFallback />}>
      <UserDetailContent params={params} />
    </Suspense>
  )
}

async function UserDetailContent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <UserDetail userId={Number(id)} />
}

function UserDetailFallback() {
  return (
    <div className="grid gap-6">
      <Button variant="ghost" className="w-fit" asChild>
        <Link href="/">بازگشت به فهرست</Link>
      </Button>
      <Skeleton className="h-80 w-full" />
    </div>
  )
}
