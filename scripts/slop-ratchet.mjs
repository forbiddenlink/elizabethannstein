#!/usr/bin/env node
/**
 * Ratchet for the vendored anti-slop oxlint rules.
 *
 * The existing findings are too many to fix in one pass, so `lint:slop` alone
 * is advisory and nothing stops the count climbing again. This job compares the
 * current count against a committed ceiling and fails when it grows, which
 * makes the number a one-way valve: new code cannot add slop, and lowering the
 * ceiling is a deliberate commit.
 *
 * Test files are excluded. Their findings are real but carry no product risk,
 * and mixing them in makes the ceiling move for reasons nobody reads.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// The pinned binary, never whatever `oxlint` PATH resolves to. A globally
// installed oxlint loads no JS plugins and reports only the built-in rules, so
// resolving off PATH gives a small, clean-looking count that checked none of
// the anti-slop rules. Measured on rocket-vitals: 12 findings against 1031.
const oxlint = fileURLToPath(new URL('../node_modules/.bin/oxlint', import.meta.url))

const baselinePath = new URL('../tools/oxlint/slop-baseline.json', import.meta.url)
const { max } = JSON.parse(readFileSync(baselinePath, 'utf8'))

// oxlint exits non-zero whenever it reports anything, so a non-zero status here
// is the normal case and only an empty stdout means the run itself failed.
let stdout = ''
try {
  stdout = execFileSync(oxlint, ['-f', 'unix', 'src/'], { encoding: 'utf8' })
} catch (error) {
  stdout = error.stdout ?? ''
  if (!stdout) {
    console.error(error.stderr || error.message)
    process.exit(1)
  }
}

const findings = stdout
  .split('\n')
  .filter((line) => /^[^ ]+:\d+:\d+:/.test(line))
  .filter((line) => !/\.test\.tsx?:/.test(line))

const count = findings.length

if (count > max) {
  console.error(`anti-slop findings rose to ${count}, ceiling is ${max}.`)
  console.error('Fix the new findings, or raise the ceiling deliberately in')
  console.error('tools/oxlint/slop-baseline.json and say why in the commit.')
  process.exit(1)
}

if (count < max) {
  console.log(`anti-slop findings down to ${count} (ceiling ${max}).`)
  console.log(`Lower "max" to ${count} in tools/oxlint/slop-baseline.json to hold the gain.`)
  process.exit(0)
}

console.log(`anti-slop findings at the ceiling: ${count}.`)
