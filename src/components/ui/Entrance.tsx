'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagneticButton } from '@/components/ui/MagneticButton'
import { ScrambleText } from '@/components/ui/ScrambleText'
import { useViewStore } from '@/lib/store'
import { ArrowRight, Sparkles, Trophy, Rocket, Code2, Building2, Brain } from 'lucide-react'
import Link from 'next/link'
import { getProjectById } from '@/lib/galaxyData'

// Seeded random for consistent star positions (fixes hydration mismatch)
function seededRandom(seed: number) {
    const x = Math.sin(seed * 9999) * 10000
    return x - Math.floor(x)
}

// Generate star particles for background
function StarParticles() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const stars = useMemo(() =>
        Array.from({ length: 100 }, (_, i) => ({
            id: i,
            x: seededRandom(i * 1) * 100,
            y: seededRandom(i * 2) * 100,
            size: seededRandom(i * 3) * 2 + 0.5,
            delay: seededRandom(i * 4) * 3,
            duration: 2 + seededRandom(i * 5) * 3,
        })), []
    )

    if (!mounted) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0.5, 1, 0],
                        scale: [0, 1, 0.8, 1, 0],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    )
}

// Hero projects for quick scan
const heroProjects = [
    { id: 'chronicle', highlight: 'Rust AI observability', icon: Brain, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'autodocs-ai', highlight: 'Product Hunt launch', icon: Rocket, gradient: 'from-purple-500 to-pink-600' },
    { id: 'timeslip-search', highlight: '$750 contest win', icon: Trophy, gradient: 'from-amber-500 to-orange-600' },
    { id: 'hire-ready', highlight: 'Voice AI SaaS', icon: Code2, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'coulson-one', highlight: '64K+ files', icon: Building2, gradient: 'from-orange-500 to-red-600' },
]

function HeroProjectsQuick() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.2 }}
            className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto"
        >
            {heroProjects.map((hero) => {
                const project = getProjectById(hero.id)
                if (!project) return null
                const Icon = hero.icon
                return (
                    <Link
                        key={hero.id}
                        href={`/work/${hero.id}`}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                        <div className={`p-1 rounded-full bg-gradient-to-br ${hero.gradient}`}>
                            <Icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-white/70 group-hover:text-white transition-colors">
                            {hero.highlight}
                        </span>
                    </Link>
                )
            })}
        </motion.div>
    )
}

// Animated letter component
function AnimatedLetter({ char, index, total }: Readonly<{ char: string; index: number; total: number }>) {
    return (
        <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
                duration: 0.6,
                delay: 0.5 + index * 0.05,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    )
}

export function Entrance() {
    const hasEntered = useViewStore((state) => state.hasEntered)
    const enter = useViewStore((state) => state.enter)
    const setWarpingIn = useViewStore((state) => state.setWarpingIn)
    const [isEntering, setIsEntering] = useState(false)

    // Skip entrance on repeat visits
    useEffect(() => {
        if (typeof window !== 'undefined' && !hasEntered) {
            const hasVisited = localStorage.getItem('ea-has-visited')
            if (hasVisited) {
                enter()
            }
        }
    }, [hasEntered, enter])

    const handleEnter = () => {
        setIsEntering(true)
        // Mark as visited for future sessions
        if (typeof window !== 'undefined') {
            localStorage.setItem('ea-has-visited', 'true')
        }
        // Start hyperspace warp immediately, enter the galaxy after 1.4s
        setWarpingIn(true)
        setTimeout(() => {
            enter()
            setWarpingIn(false)
        }, 1400)
    }

    const firstName = 'ELIZABETH'
    const lastName = 'STEIN'

    return (
        <AnimatePresence>
            {!hasEntered && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.2,
                        filter: 'blur(30px)',
                    }}
                    transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-y-auto"
                >
                    {/* Animated star particles */}
                    <StarParticles />

                    {/* Multiple gradient layers for depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-purple-950/20 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(99,102,241,0.05)_60deg,transparent_120deg)] pointer-events-none" />

                    {/* Animated rings */}
                    <motion.div
                        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full border border-white/5"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-white/5"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                        className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-full border border-indigo-500/10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-5 sm:gap-7 lg:gap-10 px-4 py-8 min-h-full w-full max-w-2xl mx-auto justify-center">
                        {/* Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex items-center justify-center gap-3 text-indigo-400/80"
                        >
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                            <span className="text-xs tracking-[0.3em] font-light uppercase">
                                Interactive Portfolio Experience
                            </span>
                            <motion.div
                                animate={{ rotate: [0, -15, 15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            >
                                <Sparkles className="w-4 h-4" />
                            </motion.div>
                        </motion.div>

                        {/* Main title with letter animation */}
                        <div className="space-y-4">
                            <div className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter" aria-hidden="true">
                                <div className="overflow-hidden pb-2 flex items-center justify-center gap-2 sm:gap-4">
                                    {/* Decorative star icon */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-14 lg:h-14 shrink-0"
                                    >
                                        <div className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600 animate-pulse" />
                                        <div className="absolute inset-0.5 sm:inset-1 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
                                        <div className="absolute inset-1 sm:inset-[6px] rounded-full bg-white/80" />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-purple-400/50"
                                            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </motion.div>
                                    <span className="whitespace-nowrap bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        {firstName.split('').map((char, i) => (
                                            <AnimatedLetter key={i} char={char} index={i} total={firstName.length} />
                                        ))}
                                    </span>
                                </div>
                                <div className="overflow-hidden pb-2">
                                    <span className="bg-linear-to-r from-purple-200 via-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                        {lastName.split('').map((char, i) => (
                                            <AnimatedLetter key={i} char={char} index={firstName.length + i} total={lastName.length} />
                                        ))}
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced gradient line under name */}
                            <motion.div
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: 1 }}
                                transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                className="h-[3px] w-full max-w-lg mx-auto bg-linear-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                            />
                        </div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.5 }}
                            className="text-white/60 text-base md:text-xl font-light tracking-wide max-w-xl mx-auto leading-relaxed"
                        >
                            Full-stack developer · AI integration · design systems
                            <br />
                            <span className="text-white/40 text-sm md:text-base">84 projects shipped across 3 years of building</span>
                        </motion.p>

                        {/* Galaxy metaphor explainer — hidden on very small phones to save space */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 1.75 }}
                            className="flex flex-col items-center gap-3"
                        >
                            <div className="hidden sm:flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-[11px] tracking-[0.2em] uppercase text-white/35">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#FF6B35' }} />
                                    Enterprise
                                </span>
                                <span className="text-white/15">·</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#00D9FF' }} />
                                    AI / ML
                                </span>
                                <span className="text-white/15">·</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#9D4EDD' }} />
                                    Full-Stack
                                </span>
                                <span className="text-white/15">·</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#06FFA5' }} />
                                    Dev Tools
                                </span>
                                <span className="text-white/15">·</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#FF006E' }} />
                                    Creative
                                </span>
                                <span className="text-white/15">·</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#FFB800' }} />
                                    Experiments
                                </span>
                            </div>
                            <p className="text-[11px] tracking-[0.15em] text-white/25 uppercase">
                                Each star is a project · each cluster is a galaxy
                            </p>
                        </motion.div>

                        {/* Enter button */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.8 }}
                            className="mt-4"
                        >
                        <MagneticButton
                            strength={0.5}
                            glowOnHover
                            onClick={handleEnter}
                            className="group relative px-14 py-6 md:px-16 md:py-7 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-2 border-indigo-500/40 hover:border-indigo-400/60 rounded-full backdrop-blur-xl overflow-hidden transition-all duration-500 shadow-2xl shadow-indigo-500/20"
                        >
                            {/* Animated border shimmer */}
                            <motion.div
                                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)', backgroundSize: '200% 100%' }}
                                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                            <span className="relative z-10 flex items-center gap-4 text-white font-semibold tracking-[0.15em] text-sm md:text-base">
                                {isEntering ? (
                                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                        LAUNCHING...
                                    </motion.span>
                                ) : (
                                    <>
                                        <ScrambleText className="tracking-[0.15em] inline-block min-w-[13ch]">ENTER UNIVERSE</ScrambleText>
                                        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
                                            <ArrowRight className="w-5 h-5" />
                                        </motion.div>
                                    </>
                                )}
                            </span>
                        </MagneticButton>
                        </motion.div>

                        {/* Featured Work — visible on all devices for recruiter visibility */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 2 }}
                            className="mt-4 text-center"
                        >
                            <p className="text-[10px] tracking-[0.3em] text-white/30 uppercase mb-2">
                                Featured Work
                            </p>
                            <HeroProjectsQuick />
                        </motion.div>

                        {/* Skip intro link - inline with content */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 2.4 }}
                            onClick={handleEnter}
                            className="mt-6 text-[11px] tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors uppercase"
                        >
                            Skip to portfolio →
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
