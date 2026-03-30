import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { CONTACT } from '@/lib/constants'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.12] py-8 relative z-10 bg-black/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <div className="flex items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Elizabeth Stein</p>
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
    </footer>
  )
}
