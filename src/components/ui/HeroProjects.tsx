'use client'

import { allProjects, getProjectById } from '@/lib/galaxyData'
import { motion } from 'framer-motion'
import { Brain, Building2, Code2, ExternalLink, Github, Rocket, Trophy } from 'lucide-react'
import Link from 'next/link'

interface HeroProject {
  id: string
  highlight: string
  icon: React.ReactNode
  gradient: string
}

const heroProjects: HeroProject[] = [
  {
    id: 'chronicle',
    highlight: 'Local-first AI observability in Rust. 29 tests, 0.11s.',
    icon: <Brain className="w-5 h-5" />,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'autodocs-ai',
    highlight: 'Launched on Product Hunt. SaaS $35-239/mo.',
    icon: <Rocket className="w-5 h-5" />,
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 'timeslip-search',
    highlight: '🏆 Won $750 Algolia Challenge. 420K+ records.',
    icon: <Trophy className="w-5 h-5" />,
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'hire-ready',
    highlight: 'Production SaaS with voice AI. Stripe live.',
    icon: <Code2 className="w-5 h-5" />,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'coulson-one',
    highlight: '64,806-file enterprise codebase. Aviation ops.',
    icon: <Building2 className="w-5 h-5" />,
    gradient: 'from-orange-500 to-red-600',
  },
]

export function HeroProjects() {
  return (
    <section className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-linear-to-r from-transparent to-white/40" />
          <span>Featured Work</span>
          <span className="w-8 h-px bg-linear-to-l from-transparent to-white/40" />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {heroProjects.map((hero, index) => {
            const project = getProjectById(hero.id)
            if (!project) return null

            return (
              <motion.div
                key={hero.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                <Link
                  href={`/work/${project.id}`}
                  className="group block p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg bg-linear-to-br ${hero.gradient} text-white shrink-0`}
                    >
                      {hero.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-white/90 truncate">
                        {project.title}
                      </h3>
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">{hero.highlight}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    {project.links?.live && (
                      <span className="inline-flex items-center gap-1 text-xs text-white/40 group-hover:text-white/60">
                        <ExternalLink className="w-3 h-3" />
                        Live
                      </span>
                    )}
                    {project.links?.github && (
                      <span className="inline-flex items-center gap-1 text-xs text-white/40 group-hover:text-white/60">
                        <Github className="w-3 h-3" />
                        Code
                      </span>
                    )}
                    <span className="ml-auto text-xs text-white/30">{project.dateRange}</span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            View all {allProjects.length} projects
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
