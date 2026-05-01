import { describe, it, expect } from 'vitest'
import { pushHistory } from '../../src/store/usePlayerStore'

describe('pushHistory', () => {
  it('moves existing track to front without duplicates', () => {
    const next = pushHistory(['a', 'b', 'c'], 'b', 5)
    expect(next).toEqual(['b', 'a', 'c'])
  })

  it('enforces history limit', () => {
    const next = pushHistory(['a', 'b', 'c'], 'd', 3)
    expect(next).toEqual(['d', 'a', 'b'])
  })
})
