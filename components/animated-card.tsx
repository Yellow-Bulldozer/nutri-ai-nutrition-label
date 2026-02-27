"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedCardProps {
    children: ReactNode
    index?: number
    className?: string
    glowColor?: string
}

export function AnimatedCard({ children, index = 0, className = "", glowColor }: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
                y: -2,
                transition: { duration: 0.2 },
            }}
            className={`relative group ${className}`}
        >
            {/* Animated glow border on hover */}
            <div
                className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                style={{
                    background: `linear-gradient(135deg, ${glowColor || "rgba(80,155,75,0.3)"}, transparent, ${glowColor || "rgba(80,155,75,0.15)"})`,
                }}
            />
            <div className="relative rounded-xl border border-border bg-card/95 backdrop-blur-sm p-6 transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-emerald-500/5">
                {children}
            </div>
        </motion.div>
    )
}

export function AnimatedSection({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function AnimatedTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`text-3xl font-bold text-foreground ${className}`}
            style={{ fontFamily: "var(--font-heading)" }}
        >
            {children}
        </motion.h1>
    )
}

export function AnimatedSubtitle({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`mt-1 text-muted-foreground ${className}`}
        >
            {children}
        </motion.p>
    )
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.98 },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
