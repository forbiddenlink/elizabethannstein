import { ContactForm } from '@/components/ui/ContactForm'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT } from '@/lib/constants'
import { Clock, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact - Elizabeth Stein Portfolio',
  description:
    'Get in touch with Elizabeth Stein. Connect via email, LinkedIn, or GitHub for collaboration opportunities and project inquiries.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact - Elizabeth Stein Portfolio',
    description:
      'Get in touch with Elizabeth Stein. Connect via email, LinkedIn, or GitHub for collaboration opportunities.',
    url: '/contact',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <a
        href="#contact-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <SiteHeader />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div id="contact-content" className="space-y-12">
          <header>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl text-white/70 max-w-2xl">
              I&apos;m always interested in hearing about new projects, collaboration opportunities,
              or just connecting with fellow developers.
            </p>
          </header>

          {/* Contact Form - Primary CTA */}
          <section className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
            <p className="text-white/60 text-sm mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4" />I typically respond within 24 hours
            </p>
            <ContactForm />
          </section>

          {/* Alternative Contact Methods */}
          <section>
            <h2 className="text-lg font-medium text-white/60 mb-4">Or reach out directly</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <a
                href={`mailto:${CONTACT.email}`}
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-white/50 text-sm">{CONTACT.email}</p>
                  </div>
                </div>
              </a>

              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              >
                <div className="flex items-center gap-3">
                  <LinkedInIcon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  <div>
                    <h3 className="font-semibold">LinkedIn</h3>
                    <p className="text-white/50 text-sm">Connect professionally</p>
                  </div>
                </div>
              </a>

              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
              >
                <div className="flex items-center gap-3">
                  <GitHubIcon className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" />
                  <div>
                    <h3 className="font-semibold">GitHub</h3>
                    <p className="text-white/50 text-sm">View my code</p>
                  </div>
                </div>
              </a>
            </div>
          </section>

          {/* Availability Section */}
          <section className="p-6 rounded-xl bg-linear-to-br from-[var(--color-galaxy-devtools)]/10 via-emerald-500/5 to-transparent border border-[var(--color-galaxy-devtools)]/20 shadow-[0_0_30px_rgba(6,255,165,0.1)]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-galaxy-devtools)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-galaxy-devtools)] shadow-[0_0_10px_var(--color-galaxy-devtools)]"></span>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2 text-[var(--color-galaxy-devtools)]">Currently Available</h2>
                <p className="text-white/70 leading-relaxed">
                  I&apos;m open to full-time roles, freelance projects, and consulting work. Looking
                  for frontend, UX engineering, or full-stack positions with a strong product focus.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <SiteFooter />
    </main>
  )
}
