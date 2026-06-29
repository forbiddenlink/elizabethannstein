import { Clock, Mail } from 'lucide-react'
import type { Metadata } from 'next'
import { ContactForm } from '@/components/ui/ContactForm'
import { SiteFooter } from '@/components/ui/SiteFooter'
import { SiteHeader } from '@/components/ui/SiteHeader'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'
import { CONTACT } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Elizabeth Stein. Open to full-time, freelance, and consulting work — frontend, UX engineering, full-stack, or Power Platform roles.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Elizabeth Stein',
    description:
      'Get in touch. Open to full-time, freelance, and consulting work — frontend, UX engineering, full-stack, or Power Platform roles.',
    url: '/contact',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      <a
        href="#contact-content"
        suppressHydrationWarning
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      <StarryBackground />
      <SiteHeader />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-32 pb-24">
        <div id="contact-content" className="space-y-12 md:space-y-16">
          <header className="max-w-3xl">
            <p className="page-hero-kicker">Collaborate</p>
            <h1 className="page-hero-title text-5xl md:text-6xl lg:text-7xl mb-5">Get in Touch</h1>
            <p className="page-hero-lede text-lg md:text-xl">
              I&apos;m always interested in hearing about new projects, collaboration opportunities,
              or just connecting with fellow developers.
            </p>
          </header>

          {/* Contact Form - Primary CTA */}
          <section className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-2 tracking-tight">Send a Message</h2>
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
                className="direct-contact-card card-hover-lift group p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.09] hover:border-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
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
                className="direct-contact-card card-hover-lift group p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.09] hover:border-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
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
                className="direct-contact-card card-hover-lift group p-5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.09] hover:border-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
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
          <section className="p-6 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-galaxy-devtools)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--color-galaxy-devtools)] "></span>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2 text-[var(--color-text-primary)]">
                  Currently Available
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Open to full-time roles, freelance, and consulting work. Looking for frontend, UX
                  engineering, full-stack, or Power Platform / Dynamics 365 positions with a strong
                  product focus. Capella B.S. graduate March 2026, ready to start.
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
