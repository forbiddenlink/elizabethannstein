import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const palette = vi.hoisted(() => ({ loaded: vi.fn() }))

async function renderLoader() {
  vi.resetModules()
  // doMock (not a hoisted mock) so each test gets a fresh factory call to count.
  vi.doMock('@/components/ui/CommandPalette', () => {
    palette.loaded()
    return { CommandPalette: () => null }
  })
  const { CommandPaletteLoader } = await import('@/components/ui/CommandPaletteLoader')
  render(<CommandPaletteLoader />)
}

function stubPointer(fine: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: fine && query === '(hover: hover) and (pointer: fine)',
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

async function settle() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 2600))
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('CommandPaletteLoader warm-up', () => {
  // The palette is keyboard-only (Cmd/Ctrl+K). Prefetching its chunk on a touch
  // device was pure unused JavaScript.
  it('does not prefetch the palette chunk on a touch device', async () => {
    stubPointer(false)
    await renderLoader()
    await settle()
    expect(palette.loaded).not.toHaveBeenCalled()
  })

  it('still warms the palette on a mouse and keyboard device', async () => {
    stubPointer(true)
    await renderLoader()
    await settle()
    expect(palette.loaded).toHaveBeenCalled()
  })
})
