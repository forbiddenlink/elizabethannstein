import { afterEach, describe, expect, it, vi } from 'vitest'
import { isWebGL2Available } from '@/lib/webgpu'

describe('isWebGL2Available', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when a WebGL2 context can be created', () => {
    const getContext = vi.fn().mockReturnValue({})
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext,
    } as unknown as HTMLCanvasElement)

    expect(isWebGL2Available()).toBe(true)
    expect(getContext).toHaveBeenCalledWith('webgl2')
  })

  it('returns false when WebGL2 context creation is unavailable', () => {
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: vi.fn().mockReturnValue(null),
    } as unknown as HTMLCanvasElement)

    expect(isWebGL2Available()).toBe(false)
  })

  it('returns false when the browser throws during context creation', () => {
    vi.spyOn(document, 'createElement').mockReturnValue({
      getContext: vi.fn().mockImplementation(() => {
        throw new Error('WebGL disabled')
      }),
    } as unknown as HTMLCanvasElement)

    expect(isWebGL2Available()).toBe(false)
  })
})
