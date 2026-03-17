'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black font-sans text-white">
            <StarryBackground />

            <div className="relative z-10 flex flex-col items-center text-center p-6">
                {/* Animated Glitch Effect */}
                <div className="relative mb-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-[12rem] font-bold leading-none bg-linear-to-b from-white to-white/10 bg-clip-text text-transparent select-none"
                    >
                        404
                    </motion.h1>
                    <motion.div
                        animate={{
                            opacity: [0, 0.5, 0],
                            x: [-10, 10, -5, 5, 0],
                            clipPath: ['inset(40% 0 61% 0)', 'inset(10% 0 10% 0)', 'inset(80% 0 5% 0)']
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "mirror",
                            times: [0, 0.2, 1]
                        }}
                        className="absolute inset-0 text-[12rem] font-bold leading-none text-red-500/50 mix-blend-screen pointer-events-none"
                    >
                        404
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 text-lg mb-2"
                >
                    Page not found
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-light tracking-wide mb-4"
                >
                    Signal Lost
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 max-w-md mb-10 text-base"
                >
                    This page doesn't exist or may have moved. Let's get you somewhere useful.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-4"
                >
                    <Link
                        href="/"
                        className="group relative inline-flex items-center gap-2 min-h-11 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <Link
                        href="/work"
                        className="group relative inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                    >
                        <span>View All Projects</span>
                    </Link>
                    <Link
                        href="/about"
                        className="group relative inline-flex items-center gap-2 min-h-11 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
                    >
                        <span>About Me</span>
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Planet */}
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-linear-to-br from-purple-900/40 to-blue-900/10 rounded-full blur-3xl opacity-50" />
        </div>
    )
}
