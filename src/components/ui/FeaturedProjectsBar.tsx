'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Building2, Brain, Trophy, Code2, Rocket, ArrowRight } from 'lucide-react'
import { getProjectById } from '@/lib/galaxyData'

// Top 5 projects to highlight for recruiters - chosen for impact/credibility
const featuredProjects = [
  { id: 'coulson-one', highlight: '64K+ files enterprise', icon: Building2, gradient: 'from-orange-500 to-red-600' },
  { id: 'chronicle', highlight: 'Rust AI observability', icon: Brain, gradient: 'from-cyan-500 to-blue-600' },
  { id: 'timeslip-search', highlight: '$750 contest winner', icon: Trophy, gradient: 'from-amber-500 to-orange-600' },
  { id: 'flo-labs', highlight: '6 production sites', icon: Rocket, gradient: 'from-purple-500 to-pink-600' },
  { id: 'finance-quest', highlight: '85% retention rate', icon: Code2, gradient: 'from-emerald-500 to-teal-600' },
]

export function FeaturedProjectsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="mt-4 md:mt-6"
    >
      <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-2">
        Featured Case Studies
      </p>
      <div className="flex flex-wrap gap-2">
        {featuredProjects.map((hero) => {
          const project = getProjectById(hero.id)
          if (!project) return null
          const Icon = hero.icon
          return (
            <Link
              key={hero.id}
              href={`/work/${hero.id}`}
              title={`View ${project.title} case study`}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 pointer-events-auto"
            >
              <div className={`p-1 rounded-full bg-gradient-to-br ${hero.gradient}`}>
                <Icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-white/70 group-hover:text-white transition-colors whitespace-nowrap">
                {hero.highlight}
              </span>
              <ArrowRight className="w-3 h-3 text-white/0 group-hover:text-white/60 transition-all -ml-1 group-hover:ml-0" />
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
