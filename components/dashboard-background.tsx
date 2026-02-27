"use client"

import { useEffect, useRef } from "react"

interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    opacity: number
    hue: number
    pulse: number
    pulseSpeed: number
}

export function DashboardBackground({ variant = "manufacturer" }: { variant?: "manufacturer" | "user" }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number>(0)
    const particlesRef = useRef<Particle[]>([])
    const mouseRef = useRef({ x: -1000, y: -1000 })

    // Green palette: manufacturer gets deeper greens, user gets brighter teal-greens
    const hueRange = variant === "manufacturer" ? { min: 120, max: 160 } : { min: 140, max: 180 }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resize()
        window.addEventListener("resize", resize)

        // Initialize particles
        const count = 60
        particlesRef.current = Array.from({ length: count }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.15 + 0.05,
            hue: hueRange.min + Math.random() * (hueRange.max - hueRange.min),
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.01 + Math.random() * 0.02,
        }))

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY }
        }
        window.addEventListener("mousemove", handleMouseMove)

        const animate = () => {
            if (!ctx || !canvas) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const particles = particlesRef.current
            const mouse = mouseRef.current

            for (const p of particles) {
                p.x += p.speedX
                p.y += p.speedY
                p.pulse += p.pulseSpeed

                // Wrap around edges
                if (p.x < -10) p.x = canvas.width + 10
                if (p.x > canvas.width + 10) p.x = -10
                if (p.y < -10) p.y = canvas.height + 10
                if (p.y > canvas.height + 10) p.y = -10

                // Mouse interaction — gentle repulsion
                const dx = p.x - mouse.x
                const dy = p.y - mouse.y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 150) {
                    const force = (150 - dist) / 150
                    p.x += (dx / dist) * force * 0.5
                    p.y += (dy / dist) * force * 0.5
                }

                const pulseOpacity = p.opacity + Math.sin(p.pulse) * 0.05
                const pulseSize = p.size + Math.sin(p.pulse * 0.7) * 0.5

                // Glow effect
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulseSize * 8)
                gradient.addColorStop(0, `hsla(${p.hue}, 60%, 50%, ${pulseOpacity})`)
                gradient.addColorStop(1, `hsla(${p.hue}, 60%, 50%, 0)`)
                ctx.fillStyle = gradient
                ctx.beginPath()
                ctx.arc(p.x, p.y, pulseSize * 8, 0, Math.PI * 2)
                ctx.fill()

                // Core dot
                ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${pulseOpacity * 2})`
                ctx.beginPath()
                ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
                ctx.fill()
            }

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const dist = Math.sqrt(dx * dx + dy * dy)

                    if (dist < 180) {
                        const opacity = (1 - dist / 180) * 0.06
                        ctx.strokeStyle = `hsla(${(particles[i].hue + particles[j].hue) / 2}, 50%, 50%, ${opacity})`
                        ctx.lineWidth = 0.5
                        ctx.beginPath()
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", handleMouseMove)
        }
    }, [hueRange.min, hueRange.max])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    )
}
