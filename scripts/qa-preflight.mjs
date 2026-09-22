import { existsSync } from 'node:fs'

// Automated QA must not silently consume a developer's service files.
//
// This used to THROW whenever a .env file existed, and the documented escape
// hatch was PLAYWRIGHT_LOAD_ENV=1. Since .env.local exists in any real
// checkout, that made "hand the app under test my live credentials" the only
// way to run Playwright locally, which is how a contact-form spec ended up one
// step from the live Resend send path.
//
// playwright.config.ts now blanks the sensitive variables for the server it
// starts, so the default run cannot reach a real service whether or not a .env
// file is present. The flag survives as a deliberate opt-in, and says so.
const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.production',
  '.env.production.local',
]

if (process.env.PLAYWRIGHT_LOAD_ENV === '1') {
  const present = envFiles.filter((file) => existsSync(file))
  if (present.length > 0) {
    console.warn(
      `[qa-preflight] PLAYWRIGHT_LOAD_ENV=1: the app under test will read ${present.join(', ')}. ` +
        'Real API calls, emails and charges are possible. Unset the flag to run against blanked credentials.'
    )
  }
}
