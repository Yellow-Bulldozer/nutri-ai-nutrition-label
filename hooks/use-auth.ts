"use client"

import useSWR from "swr"
import { useCallback } from "react"

interface UserProfile {
  age?: number
  weight?: number
  goal?: "gym" | "weight_loss" | "weight_gain" | "normal"
}

interface User {
  id: string
  name: string
  email: string
  role: "manufacturer" | "user"
  profile: UserProfile
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    if (res.status === 401) return null
    throw new Error("Failed to fetch user")
  }
  const data = await res.json()
  return data.user as User
}

export function useAuth() {
  const { data: user, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Login failed")
      }

      const data = await res.json()
      await mutate(data.user, false)
      return data.user as User
    },
    [mutate]
  )

  const register = useCallback(
    async (name: string, email: string, password: string, role: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Registration failed")
      }

      const data = await res.json()
      await mutate(data.user, false)
      return data.user as User
    },
    [mutate]
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    await mutate(null, false)
  }, [mutate])

  const updateProfile = useCallback(
    async (profile: Partial<UserProfile>) => {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Update failed")
      }

      const data = await res.json()
      await mutate(data.user, false)
      return data.user as User
    },
    [mutate]
  )

  return {
    user: user ?? null,
    isLoading,
    isError: !!error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    mutate,
  }
}
