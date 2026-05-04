import Link from 'next/link'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { CONTACT } from '@/lib/constants'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] py-10 relative z-10 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6 text-white/[0.68] text-[13px] tracking-[0.01em]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <p className="text-white/80">&copy; {new Date().getFullYear()} Elizabeth Stein</p>
            <span className="text-white/20">·</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span className="text-white/20">·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">
              Let&apos;s work together &rarr;
            </a>
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <GitHubIcon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <LinkedInIcon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
        <p className="text-center text-white/30 text-xs">
          Built with Next.js, Three.js, and obsessive attention to detail.
        </p>
      </div>
    </footer>
  )
}
