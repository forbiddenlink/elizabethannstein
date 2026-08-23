'use client'

import { Check, Copy, FileText, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { ASK_AI, SITE } from '@/lib/constants'
import styles from './AskAIAboutMe.module.css'

/**
 * "Ask AI about me" — deep links and candidate brief tool grounded in
 * this site and public/llms.txt. Recruiters get verified, grounded summaries.
 */
export function AskAIAboutMe() {
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const encoded = encodeURIComponent(ASK_AI.prompt)

  const handleCopy = () => {
    navigator.clipboard.writeText(ASK_AI.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <>
      <section aria-labelledby="ask-ai-heading" className={styles.band}>
        <div className={styles.headGroup}>
          <Sparkles className="w-3.5 h-3.5 text-[var(--le-accent-ink)]" />
          <h2 id="ask-ai-heading" className={styles.heading}>
            Vetting Liz? Ask an AI
          </h2>
        </div>

        <ul className={styles.list}>
          {ASK_AI.providers.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href.replace('{q}', encoded)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.chip}
              >
                {label} ↗<span className="sr-only">: opens {label} with a prefilled prompt</span>
              </a>
            </li>
          ))}

          <li>
            <button
              type="button"
              onClick={handleCopy}
              className={styles.chip}
              title="Copy the verified evaluation prompt to your clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied prompt
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[var(--le-muted)]" /> Copy prompt
                </>
              )}
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className={`${styles.chip} ${styles.chipPrimary}`}
              title="Inspect the AI-readable candidate specification"
            >
              <FileText className="w-3 h-3" /> Quick AI Brief
            </button>
          </li>
        </ul>
      </section>

      {/* In-page AI Brief modal */}
      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI Candidate Brief"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="w-full max-w-xl rounded-lg bg-[var(--le-paper)] border border-[var(--le-rule-strong)] p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto text-[var(--le-ink)]">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--le-rule)]">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[var(--le-ink)]">
                  Candidate Brief &middot; Elizabeth Stein
                </h3>
                <span className="font-mono text-[11px] text-[var(--le-muted)] uppercase tracking-wider">
                  Source: verified llms.txt index
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded hover:bg-[var(--le-tint)] text-[var(--le-muted)] hover:text-[var(--le-ink)]"
                aria-label="Close brief"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs sm:text-sm text-[var(--le-ink-2)] leading-relaxed">
              <p>
                <strong>Role:</strong> {SITE.title}
              </p>
              <p>
                <strong>Education:</strong> Capella University, B.S. in Information Technology
                (Software Development), Summa Cum Laude, 3.98 GPA, University Honors Pathway.
              </p>
              <div className="p-3 rounded bg-[var(--le-paper-2)] border border-[var(--le-rule)] space-y-1 text-xs">
                <span className="font-bold text-[var(--le-accent-ink)] uppercase font-mono tracking-wider block">
                  Key Verification Highlights:
                </span>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Sole developer on production Dynamics 365 / Dataverse platform (12 phases).
                  </li>
                  <li>Algolia Agent Studio Challenge Winner ($750 prize, TimeSlipSearch).</li>
                  <li>
                    Published npm author: <code>@purplegumdropz/specter</code> with 14 MCP tools.
                  </li>
                  <li>
                    Concurrent production engineering across Rocketpark, Flo Labs, &amp; personal
                    SaaS.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--le-rule)] text-xs">
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[var(--le-accent-ink)] underline font-semibold"
              >
                View raw llms.txt ↗
              </a>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="eBtn eBtnPrimary py-1 px-4 min-h-0 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
