import React from 'react'
import type { Project } from '@/lib/types'

export type BadgeType = 'live' | 'revenue' | 'featured' | 'ph-launch' | 'oss' | 'in-progress' | 'contest-winner'

interface ProjectBadgeProps {
  type: BadgeType
  className?: string
}

const badgeConfig: Record<BadgeType, {
  label: string
  color: string
  bg: string
  icon?: string
}> = {
  live: {
    label: 'LIVE',
    color: 'text-green-400',
    bg: 'bg-green-500/20 border-green-500/50',
    icon: '●'
  },
  revenue: {
    label: '$$$',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/20 border-yellow-500/50',
    icon: '💰'
  },
  featured: {
    label: 'FEATURED',
    color: 'text-purple-400',
    bg: 'bg-purple-500/20 border-purple-500/50',
    icon: '★'
  },
  'ph-launch': {
    label: 'PRODUCT HUNT',
    color: 'text-orange-400',
    bg: 'bg-orange-500/20 border-orange-500/50',
    icon: '🚀'
  },
  oss: {
    label: 'OPEN SOURCE',
    color: 'text-blue-400',
    bg: 'bg-blue-500/20 border-blue-500/50',
    icon: '📦'
  },
  'in-progress': {
    label: 'IN PROGRESS',
    color: 'text-gray-400',
    bg: 'bg-gray-500/20 border-gray-500/50',
    icon: '🔨'
  },
  'contest-winner': {
    label: 'CONTEST WINNER',
    color: 'text-amber-400',
    bg: 'bg-amber-500/20 border-amber-500/50',
    icon: '🏆'
  }
}

export function ProjectBadge({ type, className = '' }: ProjectBadgeProps) {
  const config = badgeConfig[type]
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 
        rounded-full border backdrop-blur-sm
        text-[10px] font-bold tracking-wider
        ${config.color} ${config.bg} ${className}
      `}
    >
      {config.icon && <span className="text-xs">{config.icon}</span>}
      {config.label}
    </span>
  )
}

export function ProjectBadges({ project }: { project: Project }) {
  const badges: BadgeType[] = []
  
  // Determine which badges to show
  if (project.links?.contestWin) badges.push('contest-winner')
  if (project.links?.live) badges.push('live')
  if (project.metrics?.revenue) badges.push('revenue')
  if (project.links?.productHunt) badges.push('ph-launch')
  if (project.featured) badges.push('featured')
  if (project.links?.github && !project.links?.live) badges.push('oss')
  if (project.status === 'in-progress') badges.push('in-progress')
  
  if (badges.length === 0) return null
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {badges.map(badge => (
        <ProjectBadge key={badge} type={badge} />
      ))}
    </div>
  )
}
