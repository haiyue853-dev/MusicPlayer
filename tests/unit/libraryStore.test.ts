import { describe, it, expect } from 'vitest'
import { applyScanChunk } from '../../src/store/useLibraryStore'

describe('applyScanChunk', () => {
  it('appends chunk without dropping existing items', () => {
    const prev = [{ id: '1' }, { id: '2' }]
    const next = applyScanChunk(prev as any, [{ id: '3' }] as any)
    expect(next.map((x: any) => x.id)).toEqual(['1', '2', '3'])
  })
})
