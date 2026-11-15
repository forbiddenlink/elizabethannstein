#!/usr/bin/env node
// Regenerates src/data/now.json for the /now page.
//
// Run by hand (needs an authenticated `gh`): node scripts/fetch-now-data.mjs [days]
// The site never calls GitHub at build or run time. It only reads the committed JSON, so
// every line on /now is a merged pull request you can open.
//
// Only user-authored, merged PRs in public, non-archived, non-fork forbiddenlink repos are
// kept (feat and perf only; fixes are left out). Dependency bumps, release-bot PRs and chores are dropped: the page lists what shipped.
// At most 2 entries per repo and 36 overall, newest first.
import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

const OWNER = 'forbiddenlink'
const days = Number(process.argv[2] ?? 45)
const KEEP_TYPE = /^(feat|perf)(\([^)]*\))?!?: /
const DROP_SCOPE = /^(feat|perf)\((deps|deps-dev|dependabot|security-deps)\)/
// Titles that read as a confession on a public page. Matched case-insensitively.
const DROP_WORDS = /\b(fake|fabricated|unbacked|claims?|personal email|literally)\b|personal email/i

const gh = (args) => JSON.parse(execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }))

const publicRepos = new Set(
  gh(['repo', 'list', OWNER, '--visibility', 'public', '--limit', '500', '--json', 'name,isArchived,isFork'])
    .filter((r) => !r.isArchived && !r.isFork)
    .map((r) => r.name)
)

const since = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
const prs = gh([
  'search', 'prs', '--owner', OWNER, '--author', OWNER, '--merged', '--merged-at', `>=${since}`,
  '--limit', '1000', '--json', 'repository,title,url,closedAt',
])

const PER_REPO = 2
const TOTAL = 36
const perRepo = new Map()

const entries = prs
  .filter((p) => publicRepos.has(p.repository.name))
  .filter((p) => KEEP_TYPE.test(p.title) && !DROP_SCOPE.test(p.title) && !DROP_WORDS.test(p.title))
  .map((p) => ({
    repo: p.repository.name,
    title: p.title.replace(KEEP_TYPE, '').trim(),
    type: p.title.match(KEEP_TYPE)[1],
    url: p.url,
    mergedAt: p.closedAt.slice(0, 10),
  }))
  // Newest first, features ahead of fixes on the same day, so a busy repo cannot crowd out the rest.
  .sort(
    (a, b) =>
      b.mergedAt.localeCompare(a.mergedAt) ||
      (a.type === 'feat' ? -1 : 0) - (b.type === 'feat' ? -1 : 0) ||
      a.repo.localeCompare(b.repo)
  )
  .filter((e) => {
    const n = perRepo.get(e.repo) ?? 0
    perRepo.set(e.repo, n + 1)
    return n < PER_REPO
  })
  .slice(0, TOTAL)

writeFileSync(
  new URL('../src/data/now.json', import.meta.url),
  `${JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), source: 'merged pull requests on github.com/forbiddenlink', entries }, null, 2)}\n`
)
console.log(`wrote ${entries.length} entries since ${since}`)
