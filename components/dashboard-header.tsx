"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, LogOut, History, LayoutDashboard, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function DashboardHeader() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const dashboardPath = user?.role === "manufacturer"
    ? "/dashboard/manufacturer"
    : "/dashboard/user"

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href={dashboardPath} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            NutriAI
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href={dashboardPath}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          {user?.role === "user" && (
            <Link
              href="/dashboard/recommended"
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Recommended</span>
            </Link>
          )}
          <Link
            href="/dashboard/history"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Link>

          <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
            <span className="text-sm text-muted-foreground">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}
