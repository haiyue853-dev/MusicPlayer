import { describe, it, expect } from 'vitest'
import { parseLrc } from '../../src/modules/lyrics/parseLrc'

describe('parseLrc', () => {
  it('parses timed lines and skips malformed lines', () => {
    const out = parseLrc('[00:01.00]hello\nnot-valid')
    expect(out).toEqual([{ time: 1, text: 'hello' }])
  })

  it('parses multiple lines in ascending timestamps', () => {
    const out = parseLrc('[00:02.50]b\n[00:01.20]a')
    expect(out).toEqual([
      { time: 1.2, text: 'a' },
      { time: 2.5, text: 'b' },
    ])
  })
})
