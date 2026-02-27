"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Leaf, Eye, EyeOff, Loader2, Factory, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialRole = searchParams.get("role") || ""
  const initialMode = searchParams.get("mode") || "login"

  const [mode, setMode] = useState<"login" | "register">(
    initialMode === "register" ? "register" : "login"
  )
  const [role, setRole] = useState<"manufacturer" | "user" | "">(
    initialRole === "manufacturer" || initialRole === "user" ? initialRole : ""
  )
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (mode === "register" && !role) {
      toast.error("Please select a role")
      return
    }

    setLoading(true)
    try {
      if (mode === "login") {
        const user = await login(email, password)
        toast.success("Welcome back!")
        router.push(user.role === "manufacturer" ? "/dashboard/manufacturer" : "/dashboard/user")
      } else {
        const user = await register(name, email, password, role)
        toast.success("Account created!")
        if (user.role === "user" && !user.profile?.age) {
          router.push("/setup-profile")
        } else {
          router.push(user.role === "manufacturer" ? "/dashboard/manufacturer" : "/dashboard/user")
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Leaf className="h-5 w-5" />
        </div>
        <span className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          NutriAI
        </span>
      </Link>

      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8">
        <h1 className="text-center text-2xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to access your nutrition dashboard"
            : "Start analyzing nutrition with AI"}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {mode === "register" && (
            <>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-card-foreground">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("manufacturer")}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                      role === "manufacturer"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Factory className="h-4 w-4" />
                    Manufacturer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${
                      role === "user"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Personal User
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-card-foreground">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-card-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-card-foreground">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              {"Don't have an account? "}
              <button
                onClick={() => setMode("register")}
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
