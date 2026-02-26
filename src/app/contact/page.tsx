import Link from 'next/link'
import type { Metadata } from 'next'
import { Mail, Github, Linkedin, ArrowLeft } from 'lucide-react'
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
      <a href="#contact-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <StarryBackground />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div id="contact-content" className="space-y-12">
          <header>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              I&apos;m always interested in hearing about new projects, collaboration opportunities, or just connecting with fellow developers.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
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
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Linkedin className="w-8 h-8 mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <h2 className="text-lg font-semibold mb-2">LinkedIn</h2>
              <p className="text-white/60 text-sm">Connect professionally</p>
              <span className="sr-only">Connect on LinkedIn</span>
            </a>

            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Github className="w-8 h-8 mb-4 text-white/80 group-hover:text-white transition-colors" />
              <h2 className="text-lg font-semibold mb-2">GitHub</h2>
              <p className="text-white/60 text-sm">Check out my code</p>
              <span className="sr-only">View GitHub profile</span>
            </a>
          </section>

          <section className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <h2 className="text-2xl font-bold mb-4">Open to Opportunities</h2>
            <p className="text-white/70 leading-relaxed">
              I&apos;m currently available for freelance projects, consulting work, and full-time positions.
              Whether you need help with full-stack development, AI integration, or building design systems,
              I&apos;d love to hear about your project.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-white/10 py-6 relative z-10 bg-black/50 backdrop-blur-sm">
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
