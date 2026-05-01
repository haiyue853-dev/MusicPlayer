import { describe, it, expect } from 'vitest'
import { resolveAudioSrc } from '../../src/lib/player'

describe('resolveAudioSrc', () => {
  it('converts windows local path with converter', () => {
    const src = resolveAudioSrc('D:/Music/a.mp3', (p) => `asset://localhost/${p}`)
    expect(src).toBe('asset://localhost/D:/Music/a.mp3')
  })
})
