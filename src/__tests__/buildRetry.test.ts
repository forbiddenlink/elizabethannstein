import { describe, expect, it } from 'vitest'
import { isGoogleFontFlake, MAX_ATTEMPTS } from '../../scripts/build.mjs'

describe('build retry', () => {
  it('recognises the Turbopack Google Fonts flake', () => {
    expect(
      isGoogleFontFlake(
        'Error while looking up import map: next/font/google queries have exactly one entry'
      )
    ).toBe(true)
  })

  it('recognises the webpack Google Fonts flake', () => {
    expect(
      isGoogleFontFlake(
        'An error occurred in `next/font`.\n\nTypeError: Cannot read properties of null'
      )
    ).toBe(true)
  })

  it('does not retry an ordinary build failure', () => {
    expect(isGoogleFontFlake("Type error: Property 'x' does not exist on type 'Y'")).toBe(false)
    expect(isGoogleFontFlake("Module not found: Can't resolve ./missing")).toBe(false)
  })

  it('bounds the number of attempts', () => {
    expect(MAX_ATTEMPTS).toBe(3)
  })
})
