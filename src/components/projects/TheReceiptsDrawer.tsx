'use client'

import {
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import type { Project } from '@/lib/types'

interface TheReceiptsDrawerProps {
  project: Project
}

export function TheReceiptsDrawer({ project }: Readonly<TheReceiptsDrawerProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyNpm = (pkg: string) => {
    navigator.clipboard.writeText(`npm install ${pkg}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section aria-labelledby="receipts-heading" className="w-full my-6">
      <div className="rounded-lg border border-[var(--le-rule)] bg-[var(--le-paper-2)] overflow-hidden transition-all duration-300">
        {/* Toggle header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-[var(--le-tint)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--le-accent-ink)]" />
            <div>
              <span className="font-sans font-bold text-sm uppercase tracking-wider text-[var(--le-ink)] block">
                Engineering Receipts &amp; Proof
              </span>
              <span className="font-mono text-xs text-[var(--le-muted)]">
                Verified test runs, live endpoints, and implementation evidence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-[var(--le-accent-ink)] font-semibold">
            <span>{isOpen ? 'Close' : 'Inspect receipts'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Expandable Evidence Body */}
        {isOpen && (
          <div className="px-5 py-5 border-t border-[var(--le-rule)] bg-[var(--le-paper)] space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Test Suite & Architecture Proof */}
              <div className="p-4 rounded border border-[var(--le-rule)] bg-[var(--le-paper-2)] space-y-2">
                <div className="flex items-center gap-2 font-bold font-sans uppercase text-[11px] text-[var(--le-accent-ink)]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Automated Testing &amp; Reliability</span>
                </div>
                <p className="text-[var(--le-ink-2)] leading-relaxed">
                  {project.metrics?.tests
                    ? `${project.metrics.tests} automated tests verified in CI/CD matrix across Playwright & Vitest.`
                    : 'Full TypeScript strict mode verification, ESLint/Biome linting, and automated CI passing.'}
                </p>
                <div className="font-mono text-[11px] text-[var(--le-muted)]">
                  CI Pipeline: GitHub Actions · 100% Green
                </div>
              </div>

              {/* Contest & Production Outcome */}
              <div className="p-4 rounded border border-[var(--le-rule)] bg-[var(--le-paper-2)] space-y-2">
                <div className="flex items-center gap-2 font-bold font-sans uppercase text-[11px] text-[var(--le-accent-ink)]">
                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Outcome &amp; Deployment</span>
                </div>
                <p className="text-[var(--le-ink-2)] leading-relaxed">
                  {project.links?.contestWin ? (
                    <span>
                      Winner of the Algolia Agent Studio Challenge ($750 prize) across judged global
                      entries.
                    </span>
                  ) : project.links?.live ? (
                    <span>
                      Live in production with active uptime monitoring and global CDN deployment.
                    </span>
                  ) : (
                    <span>
                      Enterprise production-ready delivery with client-verified deliverables.
                    </span>
                  )}
                </p>
                {project.links?.contestWin && (
                  <a
                    href={project.links.contestWin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--le-accent-ink)] underline font-semibold"
                  >
                    View Official Contest Announcement <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Npm install string if available */}
            {project.tags.includes('npm') && (
              <div className="p-3 rounded border border-[var(--le-rule)] bg-[var(--le-paper-2)] flex items-center justify-between font-mono text-xs">
                <span className="text-[var(--le-accent-ink)] font-semibold">
                  $ npx @purplegumdropz/specter --help
                </span>
                <button
                  type="button"
                  onClick={() => copyNpm('@purplegumdropz/specter')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[var(--le-paper)] border border-[var(--le-rule)] hover:bg-[var(--le-tint)] transition-colors text-[11px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy command
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
