'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, DollarSign, Package, TestTube } from 'lucide-react'
import { galaxies } from '@/lib/galaxyData'

export function AchievementsSection() {
  // Calculate metrics from galaxy data
  const allProjects = galaxies.flatMap(g => g.projects)
  const liveProjects = allProjects.filter(p => p.links?.live).length
  const revenueProjects = allProjects.filter(p => p.metrics?.revenue).length
  const contestWins = allProjects.filter(p => p.links?.contestWin).length
  const openSourceProjects = allProjects.filter(p => p.links?.github).length
  const totalTests = allProjects.reduce((sum, p) => sum + (p.metrics?.tests || 0), 0)
  
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white/90">
        Portfolio Highlights
      </h2>
      
      {/* Responsive grid: 2 cols mobile, contest wins hero on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* HERO CARD - Contest Wins (spans 2 cols & 2 rows on lg+) */}
        <motion.div
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="lg:col-span-2 lg:row-span-2 glass-card relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border-2 border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
          style={{
            boxShadow: '0 0 30px rgba(251, 191, 36, 0.15)',
            animation: 'fadeInUp 0.5s ease-out 0s both'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col justify-center h-full text-center lg:text-left">
            <Trophy className="w-16 h-16 lg:w-20 lg:h-20 mb-4 text-amber-400" />
            <div className="text-5xl lg:text-6xl font-black mb-3 text-amber-400">
              {contestWins}
            </div>
            <div className="text-sm lg:text-base text-white/70 uppercase tracking-wider font-semibold">
              Contest Wins
            </div>
            <p className="hidden lg:block text-xs text-white/50 mt-2">
              Recognized excellence in software development
            </p>
          </div>
        </motion.div>

        {/* Production-Ready */}
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
          style={{
            animation: 'fadeInUp 0.5s ease-out 0.1s both'
          }}
        >
          {/* Shimmer on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <Target className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
            <div className="text-3xl font-bold text-white/90 mb-1">{liveProjects}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide">Production-Ready</div>
          </div>
        </motion.div>

        {/* Revenue-Generating */}
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
          style={{
            animation: 'fadeInUp 0.5s ease-out 0.2s both'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <DollarSign className="w-10 h-10 mx-auto mb-2 text-green-400" />
            <div className="text-3xl font-bold text-white/90 mb-1">{revenueProjects}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide">Revenue-Generating</div>
          </div>
        </motion.div>

        {/* Open Source */}
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
          style={{
            animation: 'fadeInUp 0.5s ease-out 0.3s both'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <Package className="w-10 h-10 mx-auto mb-2 text-blue-400" />
            <div className="text-3xl font-bold text-white/90 mb-1">{openSourceProjects}</div>
            <div className="text-xs text-white/60 uppercase tracking-wide">Open Source</div>
          </div>
        </motion.div>

        {/* Tests Written */}
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="glass-card rounded-xl p-6 hover:bg-white/10 transition-all duration-300 relative overflow-hidden group"
          style={{
            animation: 'fadeInUp 0.5s ease-out 0.4s both'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
          
          <div className="relative z-10 text-center">
            <TestTube className="w-10 h-10 mx-auto mb-2 text-purple-400" />
            <div className="text-3xl font-bold text-white/90 mb-1">{totalTests.toLocaleString()}+</div>
            <div className="text-xs text-white/60 uppercase tracking-wide">Tests Written</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
