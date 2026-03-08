'use client'

import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { MagneticButton } from './MagneticButton'
import { useViewStore } from '@/lib/store'
import { CONTACT } from '@/lib/constants'

export function ContactSection() {
  const isJourneyMode = useViewStore((state) => state.isJourneyMode)
  const view = useViewStore((state) => state.view)

  // Hide during journey mode and exploration mode
  if (isJourneyMode || view === 'exploration') return null

  return (
    <div className="fixed top-auto bottom-32 right-6 z-20 hidden lg:flex flex-col gap-3 md:top-112 md:bottom-auto">
      <MagneticButton strength={0.3} tiltStrength={10}>
      <a
        href={`mailto:${CONTACT.email}`}
        className="group flex items-center gap-3 py-5 px-8 bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300"
        aria-label="Send me an email"
      >
        <Mail className="w-5 h-5 text-white/80 group-hover:text-white" />
        <span className="text-white/80 group-hover:text-white text-sm font-medium">Contact</span>
      </a>
      </MagneticButton>

      <div className="flex gap-2">
        <a
          href={CONTACT.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 min-w-11 p-3 flex items-center justify-center bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="LinkedIn profile"
        >
          <LinkedInIcon className="w-5 h-5 text-white/80 hover:text-white" aria-hidden="true" />
          <span className="sr-only">LinkedIn</span>
        </a>

        <a
          href={CONTACT.github}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 min-w-11 p-3 flex items-center justify-center bg-white/15 backdrop-blur-xl border border-white/30 hover:bg-white/25 hover:border-white/40 rounded-xl transition-all duration-300 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="GitHub profile"
        >
          <GitHubIcon className="w-5 h-5 text-white/80 hover:text-white" aria-hidden="true" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </div>
  )
}
