"use client"

import { useEffect, useState, lazy, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import TextType from "@/components/text-type"

const Antigravity = lazy(() => import("@/components/antigravity"))

export function BackgroundPaths({
    title = "NutriAI",
    subtitle,
    children,
    onExplore,
}: {
    title?: string
    subtitle?: string
    children?: React.ReactNode
    onExplore?: () => void
}) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
            {/* Antigravity particle background */}
            <div className="absolute inset-0">
                <Suspense fallback={null}>
                    {mounted && (
                        <Antigravity
                            className="w-full h-full"
                            color="#509b4b"
                            count={400}
                            magnetRadius={12}
                            ringRadius={12}
                            waveSpeed={0.4}
                            waveAmplitude={1}
                            particleSize={2}
                            lerpSpeed={0.1}
                            autoAnimate={true}
                            particleVariance={1}
                            rotationSpeed={0.1}
                            depthFactor={1}
                            pulseSpeed={3}
                            particleShape="capsule"
                            fieldStrength={10}
                        />
                    )}
                </Suspense>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto pointer-events-none">
                <AnimatePresence>
                    {mounted && (
                        <>
                            {/* Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-8 pointer-events-auto"
                            >
                                {children}
                            </motion.div>

                            {/* Title with typewriter effect */}
                            <motion.h1
                                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                                style={{ fontFamily: "var(--font-heading)", minHeight: "1.2em" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <TextType
                                    text={title}
                                    typingSpeed={80}
                                    initialDelay={600}
                                    loop={false}
                                    showCursor={true}
                                    cursorCharacter="|"
                                    cursorClassName="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent"
                                />
                            </motion.h1>

                            {/* Subtitle */}
                            {subtitle && (
                                <motion.p
                                    className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.2 }}
                                >
                                    {subtitle}
                                </motion.p>
                            )}

                            {/* Explore button */}
                            {onExplore && (
                                <motion.button
                                    onClick={onExplore}
                                    className="mt-10 flex flex-col items-center gap-2 cursor-pointer group pointer-events-auto"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 1.6 }}
                                >
                                    <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                                        Explore
                                    </span>
                                    <motion.div
                                        animate={{ y: [0, 8, 0] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                                    </motion.div>
                                </motion.button>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
