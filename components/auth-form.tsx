"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Leaf, Eye, EyeOff, Loader2, Factory, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { LiquidGlassButton } from "@/components/ui/liquid-glass-button"
import { BeamsBackground } from "@/components/ui/beams-background"

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12 overflow-hidden">
      {/* Beams Background Animation */}
      <BeamsBackground />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div
        className="relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg"
              whileHover={{
                scale: 1.1,
                shadow: "0 0 20px rgba(52, 211, 153, 0.5)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Leaf className="h-5 w-5" />
            </motion.div>
            <motion.span
              className="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              NutriAI
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-linear-to-br from-slate-800/40 via-slate-800/30 to-slate-900/40 p-8 backdrop-blur-xl shadow-2xl"
          variants={itemVariants}
        >
          <motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
            <motion.h1
              className="text-center text-2xl font-bold text-white"
              variants={itemVariants}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {mode === "login" ? "Welcome back" : "Create your account"}
            </motion.h1>
            <motion.p
              className="mt-2 text-center text-sm text-gray-300"
              variants={itemVariants}
            >
              {mode === "login"
                ? "Sign in to access your nutrition dashboard"
                : "Start analyzing nutrition with AI"}
            </motion.p>

            <motion.form
              key={mode}
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-5"
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {mode === "register" && (
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="text-sm font-medium text-white">I am a...</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setRole("manufacturer")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all overflow-hidden ${
                        role === "manufacturer"
                          ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/20"
                          : "border-white/10 text-gray-300 hover:border-emerald-400/30 hover:bg-emerald-400/5"
                      }`}
                    >
                      <Factory className="h-4 w-4" />
                      Manufacturer
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setRole("user")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all overflow-hidden ${
                        role === "user"
                          ? "border-blue-400/50 bg-blue-400/10 text-blue-300 shadow-lg shadow-blue-500/20"
                          : "border-white/10 text-gray-300 hover:border-blue-400/30 hover:bg-blue-400/5"
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Personal User
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {mode === "register" && (
                <motion.div
                  className="flex flex-col gap-1.5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label htmlFor="name" className="text-sm font-medium text-white">
                    Full Name
                  </label>
                  <motion.input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)" }}
                    className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all backdrop-blur-sm"
                  />
                </motion.div>
              )}

              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email
                </label>
                <motion.input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)" }}
                  className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all backdrop-blur-sm"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <motion.input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    whileFocus={{ scale: 1.01, boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)" }}
                    className="h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 pr-10 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/50 transition-all backdrop-blur-sm"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-300 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <LiquidGlassButton
                  type="submit"
                  disabled={loading}
                  variant="primary"
                  className="w-full"
                >
                  <motion.div
                    className="flex items-center justify-center gap-2"
                    animate={{ opacity: loading ? 0.7 : 1 }}
                  >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === "login" ? "Sign in" : "Create account"}
                  </motion.div>
                </LiquidGlassButton>
              </motion.div>
            </motion.form>

            <motion.div
              className="mt-6 text-center text-sm text-gray-300"
              variants={itemVariants}
            >
              {mode === "login" ? (
                <>
                  {"Don't have an account? "}
                  <motion.button
                    onClick={() => setMode("register")}
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign up
                  </motion.button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <motion.button
                    onClick={() => setMode("login")}
                    className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    Sign in
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
