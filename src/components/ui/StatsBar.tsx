'use client'

import { STATS } from '@/lib/constants'
import { motion } from 'framer-motion'

const stats = [
  { label: 'Projects Built', value: STATS.projectCount },
  { label: 'Galaxies', value: STATS.galaxyCount },
  { label: 'Years Building', value: STATS.yearsExperience },
]

export function StatsBar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      className="flex flex-nowrap items-center gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-6"
    >
      {stats.map((stat, idx) => (
        <div key={stat.label} className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-sm sm:text-base md:text-lg font-bold text-white/90">
            {stat.value}
          </span>
          <span className="text-[9px] sm:text-[10px] md:text-xs text-white/50 uppercase tracking-wider">
            {stat.label}
          </span>
          {idx < stats.length - 1 && (
            <span className="ml-2 sm:ml-4 w-px h-4 bg-white/20" aria-hidden="true" />
          )}
        </div>
      ))}
    </motion.div>
  )
}
