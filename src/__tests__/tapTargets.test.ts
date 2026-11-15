import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// CSS modules are not evaluated by jsdom, so read the rule itself. 44px is the
// size the work page filters already use.
function minHeightRem(file: string, selector: string): number {
  const css = readFileSync(join(process.cwd(), file), 'utf8')
  const block = new RegExp(`(?:^|\\n)${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`).exec(css)
  const value = block && /min-height:\s*([\d.]+)rem/.exec(block[1])
  if (!value) throw new Error(`no min-height in rem for ${selector} in ${file}`)
  return Number(value[1])
}

describe('filter chip tap targets', () => {
  it('home contents chips are at least 44px tall', () => {
    expect(
      minHeightRem('src/components/home/ContentsList.module.css', '.chip')
    ).toBeGreaterThanOrEqual(2.75)
  })

  it('work page chips are at least 44px tall', () => {
    expect(
      minHeightRem('src/components/work/WorkPageClient.module.css', '.chip')
    ).toBeGreaterThanOrEqual(2.75)
  })
})
