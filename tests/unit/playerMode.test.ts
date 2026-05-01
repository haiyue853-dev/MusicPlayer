import { describe, it, expect } from 'vitest'
import { resolveNextIndex } from '../../src/store/usePlayerStore'

describe('resolveNextIndex', () => {
  it('keeps index in repeat-one mode', () => {
    expect(resolveNextIndex({ mode: 'repeat-one', currentIndex: 1, total: 5 })).toBe(1)
  })

  it('returns next index in order mode', () => {
    expect(resolveNextIndex({ mode: 'order', currentIndex: 1, total: 5 })).toBe(2)
  })

  it('wraps in repeat-all mode', () => {
    expect(resolveNextIndex({ mode: 'repeat-all', currentIndex: 4, total: 5 })).toBe(0)
  })
})
