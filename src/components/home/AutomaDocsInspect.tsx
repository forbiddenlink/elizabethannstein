'use client'

import type { ReactNode } from 'react'
import { AUTOMADOCS_SOURCE, AUTOMADOCS_CAPTURE as C } from '@/lib/automadocsCapture'
import styles from './AutomaDocsInspect.module.css'
import { formatDay, frameStyles, InspectFrame } from './InspectFrame'

/** Inline `code` spans only; the captured docs use no other inline markdown. */
function inline(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: static text split, order never changes
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    )
  )
}

/**
 * Renders the captured markdown as it arrived: headings, paragraphs, bullet lists and fenced code.
 * Deliberately tiny, since the input is one fixed document, not user content.
 */
function Markdown({ text }: Readonly<{ text: string }>) {
  const out: ReactNode[] = []
  const lines = text.split('\n')
  let i = 0
  let key = 0
  while (i < lines.length) {
    const line = lines[i]
    if (line.startsWith('```')) {
      const code: string[] = []
      i += 1
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++])
      i += 1
      out.push(
        <pre key={key++}>
          <code>{code.join('\n')}</code>
        </pre>
      )
      continue
    }
    if (line.startsWith('# ')) out.push(<h4 key={key++}>{inline(line.slice(2))}</h4>)
    else if (line.startsWith('## ')) out.push(<h5 key={key++}>{inline(line.slice(3))}</h5>)
    else if (/^\s*- /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*- /.test(lines[i]))
        items.push(lines[i++].replace(/^\s*- /, ''))
      out.push(
        <ul key={key++}>
          {items.map((it) => (
            <li key={it}>{inline(it)}</li>
          ))}
        </ul>
      )
      continue
    } else if (line.trim()) out.push(<p key={key++}>{inline(line)}</p>)
    i += 1
  }
  return <>{out}</>
}

export function AutomaDocsInspect({ headingLevel = 2 }: Readonly<{ headingLevel?: 2 | 3 }> = {}) {
  return (
    <InspectFrame
      headingLevel={headingLevel}
      product="automadocs"
      title={
        <>
          Automa<span className={styles.brandDocs}>Docs</span>
        </>
      }
      badge="Docs that rebuild on push"
      interfaceView={
        <div className={styles.split}>
          <figure className={styles.pane}>
            <figcaption>
              <span>Input</span> {C.repo}/{C.file} · lines {C.lines[0]}-{C.lines[1]}
            </figcaption>
            {/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard reachable (WCAG 2.1.1) */}
            <pre className={styles.code} tabIndex={0} aria-label="toydb source code">
              <code>{C.source}</code>
            </pre>
          </figure>
          <figure className={styles.pane}>
            <figcaption>
              <span>Output</span> generated {formatDay(C.generatedAt.slice(0, 10))}
            </figcaption>
            {/* biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard reachable (WCAG 2.1.1) */}
            <div
              className={styles.doc}
              tabIndex={0}
              role="region"
              aria-label="Generated documentation"
            >
              <Markdown text={C.doc} />
            </div>
          </figure>
        </div>
      }
      logicMini={
        <span className={styles.mini}>
          tree-sitter chunk &rarr; {C.functionLines}-line function &rarr; smaller model &rarr; doc
        </span>
      }
      dataMini={
        <span className={styles.mini}>
          {C.totalDocs.toLocaleString('en-US')} docs · {C.byType.function} functions ·{' '}
          {C.byType.class} classes
        </span>
      }
      legend={{
        interface: (
          <p className={frameStyles.legendText}>
            Left is toydb&apos;s own source, a 14-line function. Right is the page AutomaDocs wrote
            for it, exactly as its public API returns it.
          </p>
        ),
        logic: (
          <ol className={frameStyles.steps}>
            <li>
              <span className={frameStyles.stepKey}>Parse</span>
              <span className={frameStyles.stepVal}>
                tree-sitter splits each file into functions and classes
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Route</span>
              <span className={frameStyles.stepVal}>
                Functions of 30 lines or fewer go to a smaller model; classes, READMEs and the
                architecture page always go to the larger one
                <small>
                  This function is {C.functionLines} lines, so it took the smaller-model path.
                </small>
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Write</span>
              <span className={frameStyles.stepVal}>
                The model writes one page per chunk, with the code passed in as untrusted input
              </span>
            </li>
            <li>
              <span className={frameStyles.stepKey}>Rebuild</span>
              <span className={frameStyles.stepVal}>
                A push queues only the changed files for re-analysis, so pages stay current
              </span>
            </li>
          </ol>
        ),
        data: (
          <ul className={frameStyles.indices}>
            <li>
              <span className={frameStyles.idxName}>{C.repo}</span>
              <span className={frameStyles.idxHits}>
                {C.totalDocs.toLocaleString('en-US')} generated pages
              </span>
              <span className={frameStyles.idxNote}>
                {C.byType.function} functions, {C.byType.class} classes, plus a README and an
                architecture page. Status: {C.status}, not every file is covered yet.
              </span>
            </li>
            <li>
              <span className={frameStyles.idxName}>Source</span>
              <span className={frameStyles.idxHits}>
                {C.language}, commit {C.sourceCommit}
              </span>
              <span className={frameStyles.idxNote}>
                toydb by Erik Grinaker, {C.license}. Excerpt shown for illustration.
              </span>
            </li>
          </ul>
        ),
      }}
      source={
        <>
          Real output from AutomaDocs&apos; public API, captured{' '}
          {formatDay(AUTOMADOCS_SOURCE.capturedAt)}.{' '}
          <a href={AUTOMADOCS_SOURCE.live} target="_blank" rel="noreferrer">
            Open AutomaDocs
          </a>
        </>
      }
    />
  )
}
