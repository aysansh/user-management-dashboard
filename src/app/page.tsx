import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { UsersDashboard } from "@/components/users/users-dashboard"

export default function Home() {
  return (
    <Suspense fallback={<UsersDashboardFallback />}>
      <UsersDashboard />
    </Suspense>
  )
}

function UsersDashboardFallback() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 5 }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full" />
      ))}
    </div>
  )
}
