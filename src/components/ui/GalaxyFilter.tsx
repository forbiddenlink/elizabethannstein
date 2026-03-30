'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface GalaxyFilterProps {
  galaxies: { id: string; name: string; color: string }[]
  selectedGalaxy: string | null
  onFilterChange: (galaxyId: string | null) => void
}

export function GalaxyFilter({ galaxies, selectedGalaxy, onFilterChange }: GalaxyFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <button
        onClick={() => onFilterChange(null)}
        className={cn(
          'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border',
          selectedGalaxy === null
            ? 'bg-white/15 border-white/30 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]'
            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70 hover:border-white/20'
        )}
        aria-pressed={selectedGalaxy === null}
      >
        All
      </button>
      {galaxies.map((galaxy) => {
        const isSelected = selectedGalaxy === galaxy.id
        return (
          <button
            key={galaxy.id}
            onClick={() => onFilterChange(galaxy.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2',
              isSelected
                ? 'text-white'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white/80'
            )}
            style={isSelected ? {
              backgroundColor: `${galaxy.color}25`,
              borderColor: `${galaxy.color}50`,
              boxShadow: `0 0 25px ${galaxy.color}30`,
            } : {}}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = `${galaxy.color}40`
                e.currentTarget.style.backgroundColor = `${galaxy.color}15`
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.backgroundColor = ''
              }
            }}
            aria-pressed={isSelected}
          >
            <span
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-transform duration-300',
                isSelected && 'scale-125'
              )}
              style={{
                backgroundColor: galaxy.color,
                boxShadow: isSelected ? `0 0 8px ${galaxy.color}` : 'none'
              }}
              aria-hidden="true"
            />
            {galaxy.name}
          </button>
        )
      })}
    </div>
  )
}
