import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// The three direct-contact links (email, LinkedIn, GitHub) are the page's
// main calls to action. CSS modules are not evaluated by jsdom, so read the
// rule itself and require a 44px minimum height.
describe('contact page direct links', () => {
  it('are at least 44px tall', () => {
    const css = readFileSync(join(process.cwd(), 'src/app/contact/contact.module.css'), 'utf8')
    const rule = /\.specValue a\s*\{([^}]*)\}/.exec(css)
    const height = rule && /min-height:\s*([\d.]+)rem/.exec(rule[1])
    expect(height, 'min-height in rem on .specValue a').toBeTruthy()
    expect(Number(height![1])).toBeGreaterThanOrEqual(2.75)
  })
})
