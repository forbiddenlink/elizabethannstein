import { ASK_AI } from '@/lib/constants'

/**
 * "Ask AI about me" — a small band of deep links that open an AI assistant with a
 * prompt prefilled about Elizabeth Stein, grounded in this site + public/llms.txt.
 * Recruiters who vet candidates through an assistant get a proof-based answer instead
 * of a guess. Rendered in the site footer.
 */
export function AskAIAboutMe() {
  const encoded = encodeURIComponent(ASK_AI.prompt)

  return (
    <section
      aria-labelledby="ask-ai-heading"
      className="flex flex-col items-center gap-3 text-center"
    >
      <h2 id="ask-ai-heading" className="text-white/80 text-[13px] tracking-[0.01em]">
        Curious? Ask an AI about me
      </h2>
      <ul className="flex flex-wrap items-center justify-center gap-2.5">
        {ASK_AI.providers.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href.replace('{q}', encoded)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/85 transition-colors duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/50"
            >
              {label}
              <span className="sr-only"> — opens {label} with a prompt about Elizabeth Stein</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
