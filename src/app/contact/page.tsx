import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact - Elizabeth Stein Portfolio',
  description: 'Get in touch with Elizabeth Stein. Connect via email, LinkedIn, or GitHub for collaboration opportunities and project inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact - Elizabeth Stein Portfolio',
    description: 'Get in touch with Elizabeth Stein. Connect via email, LinkedIn, or GitHub for collaboration opportunities.',
    url: '/contact',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <a href="#contact-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <StarryBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
        <div
          className="mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/(--border-opacity-default)"
        >
          <Link
            href="/"
            className="flex items-center gap-3 group min-h-11 min-w-11 p-2"
          >
            {/* Star icon */}
            <span className="relative w-7 h-7 shrink-0 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="absolute inset-0 rounded-full bg-linear-to-br from-purple-400 to-indigo-600" />
              <span className="absolute inset-0.5 rounded-full bg-linear-to-br from-fuchsia-300 to-purple-500" />
              <span className="absolute inset-1 rounded-full bg-white/80" />
            </span>
            <span className="text-base sm:text-2xl font-bold bg-linear-to-r from-white via-purple-100 to-white bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-white group-hover:to-purple-200 transition-all duration-300">
              Elizabeth Stein
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="text-white/(--text-opacity-secondary) hover:text-white transition-colors duration-normal text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded min-h-11 px-3 py-3 inline-flex items-center"
            >
              ← Home
            </Link>
            <Link
              href="/work"
              className="text-white/(--text-opacity-secondary) hover:text-white transition-colors duration-normal text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded min-h-11 px-3 py-3 inline-flex items-center"
            >
              Work
            </Link>
            <Link
              href="/about"
              className="px-3 py-3 min-h-11 inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs sm:text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div id="contact-content" className="space-y-12">
          <header>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              I&apos;m always interested in hearing about new projects, collaboration opportunities, or just connecting with fellow developers.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              <Mail className="w-8 h-8 mb-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
              <h2 className="text-lg font-semibold mb-2">Email</h2>
              <p className="text-white/60 text-sm">Send me a message directly</p>
              <span className="sr-only">Send email to Elizabeth Stein</span>
            </a>

            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              <LinkedInIcon className="w-8 h-8 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h2 className="text-lg font-semibold mb-2">LinkedIn</h2>
              <p className="text-white/60 text-sm">Connect professionally</p>
              <span className="sr-only">Connect on LinkedIn</span>
            </a>

            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              <GitHubIcon className="w-8 h-8 mb-4 text-white/80 group-hover:text-white transition-colors" />
              <h2 className="text-lg font-semibold mb-2">GitHub</h2>
              <p className="text-white/60 text-sm">Check out my code</p>
              <span className="sr-only">View GitHub profile</span>
            </a>
          </section>

          <section className="p-8 rounded-2xl bg-linear-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4">Open to Opportunities</h2>
            <p className="text-white/70 leading-relaxed">
              I&apos;m currently available for freelance projects, consulting work, and full-time positions.
              Whether you need help with full-stack development, AI integration, or building design systems,
              I&apos;d love to hear about your project.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/(--border-opacity-default) py-6 relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4 text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Elizabeth Stein</p>
          <span>•</span>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </main>
  )
}
