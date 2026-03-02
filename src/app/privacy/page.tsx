import Link from 'next/link'
import type { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { GitHubIcon, LinkedInIcon } from '@/components/ui/SocialIcons'
import { StarryBackground } from '@/components/ui/StarryBackground'

export const metadata: Metadata = {
  title: 'Privacy Policy | Elizabeth Stein',
  description: 'Privacy policy for elizabethannstein.com. Learn how this portfolio site handles your data, including analytics and cookies.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Elizabeth Stein',
    description: 'Privacy policy for elizabethannstein.com. Learn how this portfolio site handles your data.',
    url: '/privacy',
    images: [{ url: '/api/og/default', width: 1200, height: 630 }],
  },
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Skip Link for Accessibility */}
      <a href="#privacy-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-medium">
        Skip to main content
      </a>
      <StarryBackground />

      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 animate-in slide-in-from-top-4 duration-500">
        <div className="mx-auto px-6 py-4 flex items-center justify-between backdrop-blur-md bg-black/40 border-b border-white/(--border-opacity-default)">
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
          <nav className="flex items-center gap-3 sm:gap-8">
            <Link
              href="/"
              className="text-white/(--text-opacity-secondary) hover:text-white transition-colors duration-normal text-xs sm:text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 rounded min-h-11 px-4 py-3 inline-flex items-center"
            >
              ← Back to Galaxy
            </Link>
            <Link
              href="/about"
              className="px-4 py-3 min-h-11 inline-flex items-center rounded-lg bg-white/10 hover:bg-white/20 transition-all text-xs sm:text-sm font-medium hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div id="privacy-content" className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto">
          {/* Hero */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-accent-purple/20">
                <Shield className="w-8 h-8 text-accent-purple" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
            </div>
            <p className="text-lg text-white/70">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <section className="bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-white/(--text-opacity-primary) leading-relaxed">
                This is a personal portfolio website showcasing my work as a software developer.
                I respect your privacy and am committed to being transparent about any data collected
                when you visit this site.
              </p>
            </section>

            <section className="bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Information Collected</h2>
              <div className="space-y-4 text-white/(--text-opacity-primary) leading-relaxed">
                <p>
                  <strong className="text-white">Analytics:</strong> This site uses Google Analytics to understand
                  how visitors interact with the content. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Pages visited and time spent on each page</li>
                  <li>Referring websites</li>
                  <li>General geographic location (country/city level)</li>
                  <li>Device type and browser information</li>
                </ul>
                <p>
                  <strong className="text-white">No Personal Data:</strong> This site does not collect personal
                  information such as names, email addresses, or phone numbers unless you voluntarily
                  contact me via the provided email link.
                </p>
              </div>
            </section>

            <section className="bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
              <p className="text-white/(--text-opacity-primary) leading-relaxed">
                Google Analytics uses cookies to distinguish unique users and track sessions.
                These cookies do not contain personal information. You can opt out of Google Analytics
                by installing the{' '}
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-purple hover:text-accent-pink transition-colors underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>.
              </p>
            </section>

            <section className="bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <div className="space-y-4 text-white/(--text-opacity-primary) leading-relaxed">
                <p>This site uses the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Vercel:</strong> Hosting and deployment</li>
                  <li><strong>Google Analytics:</strong> Website analytics</li>
                  <li><strong>Google Fonts:</strong> Typography</li>
                </ul>
                <p>
                  Each of these services has their own privacy policies governing how they handle data.
                </p>
              </div>
            </section>

            <section className="bg-surface-2 p-8 rounded-2xl border border-white/(--border-opacity-default) backdrop-blur-sm">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-white/(--text-opacity-primary) leading-relaxed">
                If you have questions about this privacy policy or how your data is handled,
                please contact me at{' '}
                <a
                  href="mailto:purplegumdropz@gmail.com"
                  className="text-accent-purple hover:text-accent-pink transition-colors underline"
                >
                  purplegumdropz@gmail.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/(--border-opacity-default) py-8 relative z-10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white/(--text-opacity-muted) text-sm">
          <p>&copy; {new Date().getFullYear()} Elizabeth Stein.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/forbiddenlink"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              <GitHubIcon className="w-5 h-5" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/imkindageeky"
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
    </main>
  )
}
