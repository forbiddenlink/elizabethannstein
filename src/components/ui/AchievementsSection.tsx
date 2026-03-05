'use client'

import React from 'react'
import { galaxies } from '@/lib/galaxyData'

export function AchievementsSection() {
  // Calculate metrics from galaxy data
  const allProjects = galaxies.flatMap(g => g.projects)
  const liveProjects = allProjects.filter(p => p.links?.live).length
  const revenueProjects = allProjects.filter(p => p.metrics?.revenue).length
  const contestWins = allProjects.filter(p => p.links?.contestWin).length
  const openSourceProjects = allProjects.filter(p => p.links?.github).length
  const totalTests = allProjects.reduce((sum, p) => sum + (p.metrics?.tests || 0), 0)
  
  const achievements = [
    { icon: '🏆', label: 'Contest Wins', value: contestWins },
    { icon: '🎯', label: 'Production-Ready', value: liveProjects },
    { icon: '💰', label: 'Revenue-Generating', value: revenueProjects },
    { icon: '📦', label: 'Open Source', value: openSourceProjects },
    { icon: '🧪', label: 'Tests Written', value: `${totalTests.toLocaleString()}+` },
  ]
  
  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-fadeIn">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-white/90">
        Portfolio Highlights
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {achievements.map((achievement, i) => (
          <div 
            key={i}
            className="text-center"
            style={{
              animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
            }}
          >
            <div className="text-3xl md:text-4xl mb-2">{achievement.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-white/90 mb-1">
              {achievement.value}
            </div>
            <div className="text-xs md:text-sm text-white/60 uppercase tracking-wide">
              {achievement.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
