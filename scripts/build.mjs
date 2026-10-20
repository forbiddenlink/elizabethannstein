#!/usr/bin/env node
/**
 * `next build` with a retry for one known upstream flake.
 *
 * Google Fonts occasionally answers a css2 request with extensionless
 * `https://fonts.gstatic.com/l/font?kit=...` URLs (about 1 response in 60).
 * Next 16.4 cannot parse those, so the build fails with "next/font/google
 * queries have exactly one entry" (Turbopack) or "Cannot read properties of
 * null (reading '1')" (webpack), and the next attempt passes. Tracked in
 * vercel/next.js#99114; the fix (#100158) is in 16.5 canaries only.
 *
 * Only that signature is retried. Any other failure exits at once so a real
 * build error is never hidden behind a rerun. Delete this file and point the
 * `build` script back at `next build` once Next is upgraded past the fix.
 */
import { spawn } from 'node:child_process'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export const MAX_ATTEMPTS = 3

const FONT_FLAKE_SIGNATURES = [
  'next/font/google queries have exactly one entry',
  "An error occurred in `next/font`",
]

/** True when build output carries the extensionless-Google-Font signature. */
export function isGoogleFontFlake(output) {
  return FONT_FLAKE_SIGNATURES.some((signature) => output.includes(signature))
}

function runNextBuild() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/next/dist/bin/next', import.meta.url)), 'build'], {
      stdio: ['inherit', 'pipe', 'pipe'],
      env: process.env,
    })
    let output = ''
    for (const [stream, sink] of [
      [child.stdout, process.stdout],
      [child.stderr, process.stderr],
    ]) {
      stream.on('data', (chunk) => {
        output += chunk.toString()
        sink.write(chunk)
      })
    }
    child.on('close', (code) => resolve({ code: code ?? 1, output }))
  })
}

async function main() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const { code, output } = await runNextBuild()
    if (code === 0) return 0
    if (attempt < MAX_ATTEMPTS && isGoogleFontFlake(output)) {
      console.warn(`\n[build] Google Fonts flake (vercel/next.js#99114), retrying (attempt ${attempt + 1} of ${MAX_ATTEMPTS})\n`)
      continue
    }
    return code
  }
  return 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(await main())
}
