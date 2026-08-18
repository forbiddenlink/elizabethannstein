import { ASK_AI } from '@/lib/constants'
import styles from './AskAIAboutMe.module.css'

/**
 * "Ask AI about me" — a small band of deep links that open an AI assistant with a
 * prompt prefilled about Elizabeth Stein, grounded in this site + public/llms.txt.
 * Recruiters who vet candidates through an assistant get a proof-based answer instead
 * of a guess. Rendered in the site footer.
 */
export function AskAIAboutMe() {
  const encoded = encodeURIComponent(ASK_AI.prompt)

  return (
    <section aria-labelledby="ask-ai-heading" className={styles.band}>
      <h2 id="ask-ai-heading" className={styles.heading}>
        Curious? Ask an AI about me
      </h2>
      <ul className={styles.list}>
        {ASK_AI.providers.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href.replace('{q}', encoded)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.chip}
            >
              {label}
              <span className="sr-only">: opens {label} with a prompt about Elizabeth Stein</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
